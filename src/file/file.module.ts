import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';
import { fileConfig } from './config';
import { FileController } from './controller';
import { FileRepository } from './repository';
import { FileService } from './service';

@Module({
  imports: [CommonModule, ConfigModule.forFeature(fileConfig)],
  controllers: [FileController],
  providers: [FileService, FileRepository],
  exports: [FileService],
})
export class FileModule {}
