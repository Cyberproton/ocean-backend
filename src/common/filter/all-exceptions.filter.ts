import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { WsException } from '@nestjs/websockets';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { LoggerService } from 'src/logger/logger.service';
import { Environment, REQUEST_ID_TOKEN_HEADER } from '../constant';
import { BaseApiException } from '../exception';
import { RequestContext, createRequestContext } from '../request-context';

export const toErrorObject = (
  exception: any,
  options?: { hideInternalDetailError?: boolean },
) => {
  let stack: any;
  let statusCode: HttpStatus | null = null;
  let errorName: string | null = null;
  let errorCode: string | null = null;
  let message: string | null = null;
  let details: string | Record<string, any> | null = null;
  // TODO : Based on language value in header, return a localized message.
  const localizedMessage = 'en';

  // TODO : Refactor the below cases into a switch case and tidy up error response creation.
  if (exception instanceof BaseApiException) {
    statusCode = exception.getStatus();
    errorName = exception.constructor.name;
    errorCode = exception.errorCode;
    message = exception.message;
    details = exception.details || exception.getResponse();
  } else if (exception instanceof HttpException) {
    statusCode = exception.getStatus();
    errorName = exception.constructor.name;
    message = exception.message;
    details = exception.getResponse();
    stack = exception.stack;
  } else if (exception instanceof WsException) {
    statusCode = 400;
    errorName = exception.name;
    message = exception.message;
    details = exception.getError();
    stack = exception.stack;
  } else if (exception instanceof PrismaClientKnownRequestError) {
    errorName = 'DatabaseException';
    errorCode = 'database-exception';
    if (exception.code.startsWith('P1')) {
      statusCode = 500;
      message = 'Connection error';
    } else if (exception.code === 'P2015' || exception.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found';
    } else if (exception.code.startsWith('P2')) {
      statusCode = 400;
      message = 'Input constraint/validation failed';
    } else {
      statusCode = 500;
      message = 'Unknown error';
    }
    stack = exception.stack;
  } else if (exception instanceof PrismaClientValidationError) {
    errorName = 'DatabaseException';
    errorCode = 'database-exception';
    statusCode = 400;
    message = 'Input constraint/validation failed';
    stack = exception.stack;
  } else if (exception instanceof Error) {
    errorName = exception.constructor.name;
    message = exception.message;
    stack = exception.stack;
  }

  // Set to internal server error in case it did not match above categories.
  statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  errorName = errorName || 'InternalException';
  message = message || 'Internal server error';

  // NOTE: For reference, please check https://cloud.google.com/apis/design/errors
  const error = {
    statusCode,
    message,
    localizedMessage,
    errorName,
    errorCode,
    details,
    stack,
  };

  // Suppress original internal server error details in prod mode
  const isProMood = options?.hideInternalDetailError !== false;
  if (isProMood && statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
    error.message = 'Internal server error';
  }

  return error;
};

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  /** set logger context */
  constructor(
    private config: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AllExceptionsFilter.name);
  }

  catch(exception: T, host: ArgumentsHost): any {
    const contextType = host.getType();
    let path: string;
    const timestamp = new Date().toISOString();
    let requestId: any;
    let requestContext: RequestContext;

    if (contextType === 'http') {
      const ctx = host.switchToHttp();
      const req: Request = ctx.getRequest<Request>();
      path = req.url;
      requestId = req.headers[REQUEST_ID_TOKEN_HEADER];
      requestContext = createRequestContext(req);
    }
    // else if (contextType === 'ws') {
    //   const ctx = host.switchToWs();
    //   const client = ctx.getClient() as Socket;
    //   const req = client.handshake;
    //   path = req.url;
    //   requestId = req.headers[REQUEST_ID_TOKEN_HEADER];
    //   requestContext = createRequestContextFromWs(client);
    // }
    else {
      throw new Error('Unsupported context type');
    }

    // NOTE: For reference, please check https://cloud.google.com/apis/design/errors
    const errorObject = toErrorObject(exception, {
      hideInternalDetailError: false,
    });
    const error = {
      statusCode: errorObject.statusCode,
      message: errorObject.message,
      localizedMessage: errorObject.localizedMessage,
      errorName: errorObject.errorName,
      errorCode: errorObject.errorCode,
      details: errorObject.details,
      // Additional meta added by us.
      path,
      requestId,
      timestamp,
    };
    this.logger.warn(error.message, {
      ctx: requestContext,
      meta: {
        error,
        stack: errorObject.stack,
      },
    });

    // Suppress original internal server error details in prod mode
    const isProMood =
      this.config.get<string>('app.env') !== Environment.Development;
    if (isProMood && error.statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      error.message = 'Internal server error';
    }

    if (contextType === 'http') {
      const ctx = host.switchToHttp();
      const res: Response = ctx.getResponse<Response>();
      res.status(error.statusCode).json({ error });
    }
    // else {
    //   const ctx = host.switchToWs();
    //   const client = ctx.getClient() as Socket;
    //   client.emit('error', { error: error });

    //   // ACK response
    //   const callback = host.getArgByIndex(2);
    //   if (callback && typeof callback === 'function') {
    //     callback({ error: error });
    //   }
    // }
  }
}
