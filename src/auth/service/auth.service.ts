import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { RequestContext } from 'src/common/request-context';
import { RoleService } from 'src/role/service';
import { User } from 'src/user/model';
import { UserService } from 'src/user/service';
import { AuthConfig, authConfig } from '../config';
import {
  LoginOutputDto,
  RegisterInputDto,
  RegisterOutputDto,
  TokenOutputDto,
  UserAccessTokenClaims,
} from '../dto';
import { WrongUsernameOrPasswordException } from '../exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY) private readonly authConfig: AuthConfig,
  ) {}

  async login(context: RequestContext): Promise<LoginOutputDto> {
    const token = await this.getAuthToken(context.user);
    return new LoginOutputDto(token);
  }

  async register(dto: RegisterInputDto): Promise<RegisterOutputDto> {
    const hashedPassword = Bun.password.hashSync(dto.password, {
      algorithm: 'bcrypt',
      cost: 10,
    });
    const user = await this.userService.createUser({
      ...dto,
      password: hashedPassword,
    });
    return new RegisterOutputDto(user);
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserAccessTokenClaims> {
    // The userService will throw Unauthorized in case of invalid username/password.
    const user = await this.validateUsernameAndPassword(username, password);

    // Prevent disabled users from logging in.
    if (user.isBanned) {
      throw new UnauthorizedException('This user account has been banned.');
    }

    // Get user roles
    const roles = await this.roleService.findRolesByUserId(user.id);

    return plainToClass(
      UserAccessTokenClaims,
      { ...user, roles },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  private getAuthToken(user: UserAccessTokenClaims) {
    const subject = { sub: user.id };
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };

    const authToken = {
      refreshToken: this.jwtService.sign(subject, {
        expiresIn: this.authConfig.refreshTokenExpirationTime,
      }),
      accessToken: this.jwtService.sign(
        { ...payload, ...subject },
        { expiresIn: this.authConfig.accessTokenExpirationTime },
      ),
    };
    return plainToClass(TokenOutputDto, authToken, {
      excludeExtraneousValues: true,
    });
  }

  async checkUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<boolean> {
    try {
      await this.validateUsernameAndPassword(username, password);
      return true;
    } catch (e) {
      if (e instanceof WrongUsernameOrPasswordException) {
        return false;
      }
      throw e;
    }
  }

  async validateUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.userService.findUserByUsername(username);
    if (user == null) {
      throw new WrongUsernameOrPasswordException();
    }
    if (!Bun.password.verifySync(password, user.password, 'bcrypt')) {
      throw new WrongUsernameOrPasswordException();
    }
    return user;
  }
}
