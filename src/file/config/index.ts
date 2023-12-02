import { ConfigType, registerAs } from '@nestjs/config';
import { IsString, IsUrl } from 'class-validator';

export const fileConfig = registerAs('file', () => ({
  endpoint: process.env.FILE_ENDPOINT || '',
  region: process.env.FILE_REGION || '',
  accessKey: process.env.FILE_ACCESS_KEY || '',
  secretKey: process.env.FILE_SECRET_KEY || '',
  bucket: process.env.FILE_BUCKET || '',
}));

export type FileConfig = ConfigType<typeof fileConfig>;

export class FileConfigValidationSchema {
  @IsUrl()
  FILE_ENDPOINT: string;

  @IsString()
  FILE_REGION: string;

  @IsString()
  FILE_ACCESS_KEY: string;

  @IsString()
  FILE_SECRET_KEY: string;

  @IsString()
  FILE_BUCKET: string;
}
