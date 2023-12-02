import { ConfigType, registerAs } from '@nestjs/config';
import { IsString, IsUrl } from 'class-validator';
import { validateConfig } from 'src/common/config';
import { requireNonNull } from 'src/common/util';

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

export const fileConfig = registerAs('file', () => {
  validateConfig(FileConfigValidationSchema, process.env);

  return {
    endpoint: requireNonNull(process.env.FILE_ENDPOINT),
    region: requireNonNull(process.env.FILE_REGION),
    accessKey: requireNonNull(process.env.FILE_ACCESS_KEY),
    secretKey: requireNonNull(process.env.FILE_SECRET_KEY),
    bucket: requireNonNull(process.env.FILE_BUCKET),
  };
});

export type FileConfig = ConfigType<typeof fileConfig>;
