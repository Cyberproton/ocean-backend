import { ConfigModuleOptions } from '@nestjs/config';
import { AppConfigValidationSchema, appConfig } from './app.config';
import { validateMany } from './validate';

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  cache: true,
  expandVariables: true,
  envFilePath: '.env',
  load: [appConfig],
  validate: (config) => validateMany([AppConfigValidationSchema], config),
};
