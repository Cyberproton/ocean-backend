import { Inject, Injectable, Scope } from '@nestjs/common';
import winston, { createLogger, format, transports } from 'winston';
import { AppConfig, appConfig } from '../common/config';
import { Environment } from '../common/constant';
import { RequestContext } from '../common/request-context';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private context?: string;
  private logger: winston.Logger;
  private env: Environment;

  constructor(@Inject(appConfig.KEY) appConfig: AppConfig) {
    this.env = appConfig.env || Environment.Development;
    let loggerFormat: any | null = undefined;
    if (this.env === Environment.Development) {
      loggerFormat = format.prettyPrint();
    }
    const silent = this.env === Environment.Test;
    this.logger = createLogger({
      transports: [new transports.Console()],
      format: loggerFormat,
      silent: silent,
    });
  }

  setContext(context: string) {
    this.context = context;
  }

  error(
    message: string,
    extra?: { ctx?: RequestContext | undefined; meta?: Record<string, any> },
  ): LoggerService {
    const timestamp = new Date().toISOString();

    this.logger.error({
      message,
      contextName: this.context,
      ctx: extra?.ctx,
      timestamp,
      ...extra?.meta,
    });

    return this;
  }

  warn(
    message: string,
    extra?: { ctx?: RequestContext | undefined; meta?: Record<string, any> },
  ): LoggerService {
    const timestamp = new Date().toISOString();

    this.logger.warn({
      message,
      contextName: this.context,
      ctx: extra?.ctx,
      timestamp,
      ...extra?.meta,
    });

    return this;
  }

  debug(
    message: string,
    extra?: { ctx?: RequestContext | undefined; meta?: Record<string, any> },
  ): LoggerService {
    const timestamp = new Date().toISOString();

    this.logger.debug({
      message,
      contextName: this.context,
      ctx: extra?.ctx,
      timestamp,
      ...extra?.meta,
    });

    return this;
  }

  verbose(
    message: string,
    extra?: { ctx?: RequestContext | undefined; meta?: Record<string, any> },
  ): LoggerService {
    const timestamp = new Date().toISOString();

    this.logger.verbose({
      message,
      contextName: this.context,
      ctx: extra?.ctx,
      timestamp,
      ...extra?.meta,
    });

    return this;
  }

  log(
    message: string,
    extra?: { ctx?: RequestContext | undefined; meta?: Record<string, any> },
  ): LoggerService {
    const timestamp = new Date().toISOString();

    this.logger.info({
      message,
      contextName: this.context,
      ctx: extra?.ctx,
      timestamp,
      ...extra?.meta,
    });

    return this;
  }
}
