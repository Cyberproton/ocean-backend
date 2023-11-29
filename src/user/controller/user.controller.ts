import { Controller, Post } from '@nestjs/common';
import { UserService } from '../service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('reset-password')
  resetPassword() {
    // ...
  }
}
