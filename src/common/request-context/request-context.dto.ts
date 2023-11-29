import { UserAccessTokenClaims } from 'src/auth/dto';

export class RequestContext {
  public requestId: string;

  public url: string;

  public ip?: string;

  public user: UserAccessTokenClaims;
}
