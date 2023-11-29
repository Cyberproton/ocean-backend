import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export type ConfigValidationOptions = {
  cls: ClassConstructor<object>;
  config: Record<string, unknown>;
};

export const validateMany = (
  classes: ClassConstructor<object>[],
  config: Record<string, unknown>,
) => {
  const res = classes.map((cls) => validate(cls, config));
  // Merge all configs into one
  return Object.assign({}, ...res);
};

export const validate = (
  cls: ClassConstructor<object>,
  config: Record<string, unknown>,
) => {
  const validatedConfig = plainToInstance(cls, config, {
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
