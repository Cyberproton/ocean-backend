import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';

import { createRequestContext } from 'src/common/request-context';
import { LoggerService } from 'src/logger/logger.service';
import { STRATEGY_LOCAL } from '../constant';
import { UserAccessTokenClaims } from '../dto';
import { AuthService } from '../service';

/**
 * Use to provide strategy for local auth guard
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, STRATEGY_LOCAL) {
  constructor(
    private authService: AuthService,
    private readonly logger: LoggerService,
  ) {
    // Add option passReqToCallback: true to configure strategy to be request-scoped.
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    });
    this.logger.setContext(LocalStrategy.name);
  }

  async validate(
    request: Request,
    username: string,
    password: string,
  ): Promise<UserAccessTokenClaims> {
    const ctx = createRequestContext(request);

    const account = await this.authService.validateUser(username, password);

    // Passport automatically creates a user object, based on the value we return from the validate() method,
    // and assigns it to the Request object as req.user
    return account;
  }
}
