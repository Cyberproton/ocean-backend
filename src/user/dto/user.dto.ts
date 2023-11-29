import { Matches } from 'class-validator';
import {
  PASSWORD_REGEX,
  PASSWORD_VALIDATION_MESSAGE,
  USERNAME_REGEX,
  USERNAME_VALIDATION_MESSAGE,
} from '../constant';

export class CreateUserDto {
  @Matches(USERNAME_REGEX, {
    message: USERNAME_VALIDATION_MESSAGE,
  })
  username: string;

  @Matches(PASSWORD_REGEX, {
    message: PASSWORD_VALIDATION_MESSAGE,
  })
  password: string;
}
