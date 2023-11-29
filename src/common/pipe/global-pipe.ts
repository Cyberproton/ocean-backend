import { ValidationError, ValidationPipe } from '@nestjs/common';
import { InvalidInputException } from '../exception';

const pipeExceptionFactory = (errors: ValidationError[]) => {
  // Get first error only
  const error = errors[0];
  const invalidProperty = error.property;
  let message = error.constraints
    ? Object.values(error.constraints)[0]
    : undefined;
  if (
    error.contexts &&
    Object.values(error.contexts)[0].generalMessage === true
  ) {
    message = undefined;
  }
  return new InvalidInputException(invalidProperty, message);
};

export const globalPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
  exceptionFactory: pipeExceptionFactory,
});
