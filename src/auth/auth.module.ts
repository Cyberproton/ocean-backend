import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CommonModule } from 'src/common/common.module';
import { RoleModule } from 'src/role/role.module';
import { UserModule } from 'src/user/user.module';
import { AuthConfig, authConfig } from './config';
import { STRATEGY_JWT_AUTH } from './constant';
import { AuthController } from './controller';
import { AuthService } from './service';
import { JwtAuthStrategy, JwtRefreshStrategy, LocalStrategy } from './strategy';
import { WsJwtStrategy } from './strategy/jwt-auth-ws.strategy';

@Module({
  imports: [
    CommonModule,
    JwtModule.registerAsync({
      imports: [CommonModule],
      useFactory: async (authConfig: AuthConfig) => ({
        secret: authConfig.jwtSecret,
      }),
      inject: [authConfig.KEY],
    }),
    PassportModule.register({ defaultStrategy: STRATEGY_JWT_AUTH }),
    RoleModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAuthStrategy,
    JwtRefreshStrategy,
    WsJwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
