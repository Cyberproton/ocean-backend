import { ConfigModuleOptions } from '@nestjs/config';
import { AuthConfigValidationSchema, authConfig } from 'src/auth/config';
import {
  DatabaseConfigValidationSchema,
  databaseConfig,
} from 'src/prisma/config';
import { AppConfigValidationSchema, appConfig } from './app.config';
import { validateMany } from './validate';

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  cache: true,
  expandVariables: true,
  envFilePath: '.env',
  load: [appConfig, authConfig, databaseConfig],
  validate: (config) =>
    validateMany(
      [
        AppConfigValidationSchema,
        AuthConfigValidationSchema,
        DatabaseConfigValidationSchema,
      ],
      config,
    ),
};
