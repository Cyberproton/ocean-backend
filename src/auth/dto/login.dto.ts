import { Expose } from 'class-transformer';
import { Matches } from 'class-validator';
import {
  PASSWORD_REGEX,
  PASSWORD_VALIDATION_MESSAGE,
  USERNAME_REGEX,
  USERNAME_VALIDATION_MESSAGE,
} from 'src/user/constant';

export class LoginInputDto {
  @Matches(USERNAME_REGEX, { message: USERNAME_VALIDATION_MESSAGE })
  username: string;

  @Matches(PASSWORD_REGEX, { message: PASSWORD_VALIDATION_MESSAGE })
  password: string;
}

export class LoginOutputDto {
  constructor(input: Partial<LoginOutputDto>) {
    Object.assign(this, input);
  }

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
