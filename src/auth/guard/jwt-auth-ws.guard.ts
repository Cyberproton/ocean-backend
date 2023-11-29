import { ExecutionContext, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { AuthConfig, authConfig } from '../config';
import { STRATEGY_JWT_AUTH_WEBSOCKET } from '../constant';

export class WsAuthGuard extends AuthGuard(STRATEGY_JWT_AUTH_WEBSOCKET) {
  constructor(
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
    return super.canActivate(context);
  }

  override getRequest(context: ExecutionContext) {
    return context.switchToWs().getClient().handshake;
  }
}
