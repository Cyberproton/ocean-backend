import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { UserController } from './controller';
import { UserRepository } from './repository';
import { UserService } from './service';

@Module({
  imports: [CommonModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
