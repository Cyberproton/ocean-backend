import { Expose } from 'class-transformer';
import { Matches } from 'class-validator';
import {
  PASSWORD_REGEX,
  PASSWORD_VALIDATION_MESSAGE,
  USERNAME_REGEX,
  USERNAME_VALIDATION_MESSAGE,
} from 'src/user/constant';

export class RegisterInputDto {
  @Matches(USERNAME_REGEX, { message: USERNAME_VALIDATION_MESSAGE })
  username: string;

  @Matches(PASSWORD_REGEX, { message: PASSWORD_VALIDATION_MESSAGE })
  password: string;
}

export class RegisterOutputDto {
  constructor(input: Partial<RegisterInputDto>) {
    Object.assign(this, input);
  }

  @Expose()
  readonly id: number;

  @Expose()
  readonly username: string;
}
