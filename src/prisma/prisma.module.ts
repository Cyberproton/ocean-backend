import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { PrismaService } from './service';

@Module({
  imports: [LoggerModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
