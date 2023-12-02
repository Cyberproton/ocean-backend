import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export const validateMany = (
  schemaClasses: ClassConstructor<object>[],
  config: Record<string, unknown>,
) => {
  const res = schemaClasses.map((cls) => validateConfig(cls, config));
  // Merge all configs into one
  return Object.assign({}, ...res);
};

export const validateConfig = (
  schemaClass: ClassConstructor<object>,
  config: Record<string, unknown>,
) => {
  const validatedConfig = plainToInstance(schemaClass, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
};
