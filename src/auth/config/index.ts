import { ConfigType, registerAs } from '@nestjs/config';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { parseBoolean } from 'src/common/util';

export const authConfig = registerAs('auth', () => ({
  accessTokenExpirationTime: process.env.TOKEN_ACCESS_EXPIRATION_TIME,
  refreshTokenExpirationTime: process.env.TOKEN_REFRESH_EXPIRATION_TIME,
  bcryptSaltOrRound: process.env.BCRYPT_SALT_ROUNDS,
  jwtSecret: process.env.TOKEN_SECRET,
  disabled:
    process.env.AUTH_DISABLED == null
      ? false
      : parseBoolean(process.env.AUTH_DISABLED),
}));

export type AuthConfig = ConfigType<typeof authConfig>;

export class AuthConfigValidationSchema {
  @IsString()
  TOKEN_ACCESS_EXPIRATION_TIME: string;

  @IsString()
  TOKEN_REFRESH_EXPIRATION_TIME: string;

  @IsString()
  BCRYPT_SALT_ROUNDS: string;

  @IsString()
  TOKEN_SECRET: string;

  @IsOptional()
  @IsBoolean()
  AUTH_DISABLED: boolean;
}
