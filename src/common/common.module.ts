import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'src/logger/logger.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { configModuleOptions } from './config';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    LoggerModule,
    PrismaModule,
  ],
  providers: [],
  exports: [ConfigModule, LoggerModule, PrismaModule],
})
export class CommonModule {}
