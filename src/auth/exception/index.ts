import { BaseApiException } from 'src/common/exception';

export class WrongUsernameOrPasswordException extends BaseApiException {
  constructor() {
    super({ message: 'Wrong username or password' });
  }
}

export class LoginSessionExpiredException extends BaseApiException {
  constructor() {
    super({
      message: 'Your login session has expired. Please re-login again',
      errorCode: 'login-session-expired',
      status: 401,
    });
  }
}
