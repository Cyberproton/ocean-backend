import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { AuthConfig, authConfig } from '../config';
import { STRATEGY_JWT_AUTH } from '../constant';
import { IS_PUBLIC_KEY } from '../decorator';
import { LoginSessionExpiredException } from '../exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard(STRATEGY_JWT_AUTH) {
  constructor(
    private reflector: Reflector,
    @Inject(authConfig.KEY)
    private readonly authConfigApi: AuthConfig,
  ) {
    super();
  }

  override canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.authConfigApi.disabled) {
      return true;
    }
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  override handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err) {
      throw err;
    }
    if (!user) {
      if (info instanceof TokenExpiredError) {
        throw new LoginSessionExpiredException();
      }
      throw new UnauthorizedException(`${info}`);
    }
    return user;
  }
}
