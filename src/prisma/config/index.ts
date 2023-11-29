import { Optional } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';
import { IsInt } from 'class-validator';

export const databaseConfig = registerAs('database', () => ({
  connectionMaxRetries:
    process.env.DATABASE_CONNECTION_MAX_RETRIES == null
      ? 3
      : parseInt(process.env.DATABASE_CONNECTION_MAX_RETRIES),
}));

export type DatabaseConfig = ConfigType<typeof databaseConfig>;

export class DatabaseConfigValidationSchema {
  @Optional()
  @IsInt()
  DATABASE_CONNECTION_MAX_RETRIES: number;
}
