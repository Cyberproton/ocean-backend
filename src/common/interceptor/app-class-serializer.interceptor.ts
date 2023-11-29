import { ClassSerializerInterceptor } from '@nestjs/common';

export class AppClassSerializerInterceptor extends ClassSerializerInterceptor {
  constructor(reflector) {
    super(reflector, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
