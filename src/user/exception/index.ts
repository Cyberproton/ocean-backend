import { BaseApiException } from 'src/common/exception/base-api-exception';

export class UserNotFoundException extends BaseApiException {
  constructor() {
    super({ message: 'User not found', status: 404 });
  }
}

export class WrongUsernameOrPasswordException extends BaseApiException {
  constructor() {
    super({ message: 'Wrong username or password', status: 400 });
  }
}

export class UsernameIsAlreadyTaken extends BaseApiException {
  constructor() {
    super({ message: 'Username is already taken' });
  }
}
