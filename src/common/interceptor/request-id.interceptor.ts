import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { v4, validate } from 'uuid';
import { REQUEST_ID_TOKEN_HEADER } from '../constant';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    if (
      !req.headers[REQUEST_ID_TOKEN_HEADER] ||
      !validate(req.headers[REQUEST_ID_TOKEN_HEADER] as string)
    ) {
      req.headers[REQUEST_ID_TOKEN_HEADER] = v4();
    }

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        res.set(REQUEST_ID_TOKEN_HEADER, req.headers[REQUEST_ID_TOKEN_HEADER]);
      }),
    );
  }
}

// @Injectable()
// export class SocketRequestIdInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const client: Socket = context.switchToWs().getClient();
//     const req = client.handshake;
//     if (
//       !req.headers[REQUEST_ID_TOKEN_HEADER] ||
//       !validate(req.headers[REQUEST_ID_TOKEN_HEADER] as string)
//     ) {
//       req.headers[REQUEST_ID_TOKEN_HEADER] = v4();
//     }

//     return next.handle();
//   }
// }
