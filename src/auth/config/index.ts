import { ConfigType, registerAs } from '@nestjs/config';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { validateConfig } from 'src/common/config';
import { parseBoolean, requireNonNull } from 'src/common/util';

export class AuthConfigValidationSchema {
  @IsOptional()
  @IsString()
  TOKEN_ACCESS_EXPIRATION_TIME: string;

  @IsOptional()
  @IsString()
  TOKEN_REFRESH_EXPIRATION_TIME: string;

  @IsOptional()
  @IsString()
  BCRYPT_SALT_ROUNDS: string;

  @IsString()
  TOKEN_SECRET: string;

  @IsOptional()
  @IsBoolean()
  AUTH_DISABLED: boolean;
}

export const authConfig = registerAs('auth', () => {
  validateConfig(AuthConfigValidationSchema, process.env);

  return {
    accessTokenExpirationTime:
      process.env.TOKEN_ACCESS_EXPIRATION_TIME || '15m',
    refreshTokenExpirationTime:
      process.env.TOKEN_REFRESH_EXPIRATION_TIME || '7d',
    bcryptSaltOrRound: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10'),
    jwtSecret: requireNonNull(process.env.TOKEN_SECRET),
    disabled:
      process.env.AUTH_DISABLED == null
        ? false
        : parseBoolean(process.env.AUTH_DISABLED),
  };
});

export type AuthConfig = ConfigType<typeof authConfig>;
