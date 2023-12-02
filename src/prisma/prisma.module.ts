import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'src/logger/logger.module';
import { databaseConfig } from './config';
import { PrismaService } from './service';

@Module({
  imports: [LoggerModule, ConfigModule.forFeature(databaseConfig)],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
