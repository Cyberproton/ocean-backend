import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConfig, authConfig } from '../config';
import { STRATEGY_JWT_AUTH_WEBSOCKET } from '../constant';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(
  Strategy,
  STRATEGY_JWT_AUTH_WEBSOCKET,
) {
  constructor(@Inject(authConfig.KEY) authConfig: AuthConfig) {
    super({
      jwtFromRequest: (handshake: any): string | null => {
        let token = handshake.auth.token;
        if (token == null) {
          token = ExtractJwt.fromAuthHeaderAsBearerToken()(handshake);
        }
        return token;
      },
      secretOrKey: authConfig.jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      return {
        id: payload.sub,
        email: payload.email,
        roles: payload.roles,
      };
    } catch (error) {
      throw new WsException('Unauthorized access');
    }
  }
}
