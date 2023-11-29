import { ConfigType, registerAs } from '@nestjs/config';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Environment } from '../constant';

export const appConfig = registerAs('app', () => ({
  port: process.env.APP_PORT == null ? 3000 : parseInt(process.env.APP_PORT),
  env:
    process.env.NODE_ENV == null
      ? Environment.Development
      : (process.env.NODE_ENV as Environment),
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
  apiPrefix: process.env.API_PREFIX,
}));

export type AppConfig = ConfigType<typeof appConfig>;

export class AppConfigValidationSchema {
  @IsOptional()
  @IsNumber()
  APP_PORT: number;

  @IsOptional()
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsOptional()
  @IsString()
  API_PREFIX: string;
}
