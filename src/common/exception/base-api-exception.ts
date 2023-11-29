import { HttpException } from '@nestjs/common';
import { toKebabCase } from '../util';

export class BaseApiException extends HttpException {
  public errorCode: string;
  public localizedMessage: Record<string, string> | null | undefined;
  public details: string | Record<string, any> | null | undefined;

  constructor(data: {
    message: string;
    errorCode?: string;
    status?: number;
    details?: string | Record<string, any>;
    localizedMessage?: Record<string, string>;
  }) {
    // Calling parent constructor of base Exception class.
    super(data.message, data.status ?? 400);
    this.name = this.constructor.name;
    this.errorCode = data.errorCode
      ? createExceptionErrorCode(data.errorCode)
      : createExceptionErrorCode(this.name);
    this.localizedMessage = data.localizedMessage;
    this.details = data.details;
  }
}

function createExceptionErrorCode(str) {
  const raw = toKebabCase(str);
  return raw.replace(/-exception$/, '');
}
