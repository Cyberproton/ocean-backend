import { Expose } from 'class-transformer';
import { Role } from 'src/role/constant';

export class TokenOutputDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}

export class UserAccessTokenClaims {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  roles: Role[];
}

export class UserRefreshTokenClaims {
  @Expose()
  id: number;
}
