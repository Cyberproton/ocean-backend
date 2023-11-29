import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { RoleRepository } from './repository';
import { RoleService } from './service';

@Module({
  imports: [CommonModule],
  providers: [RoleService, RoleRepository],
  exports: [RoleService],
})
export class RoleModule {}
