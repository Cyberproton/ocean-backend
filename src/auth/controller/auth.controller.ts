import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppClassSerializerInterceptor } from 'src/common/interceptor';
import { ReqContext, RequestContext } from 'src/common/request-context';
import { Public } from '../decorator';
import { RegisterInputDto, RegisterOutputDto } from '../dto/register.dto';
import { LocalAuthGuard } from '../guard';
import { AuthService } from '../service';

@UseInterceptors(AppClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@ReqContext() context: RequestContext) {
    return this.authService.login(context);
  }

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterInputDto): Promise<RegisterOutputDto> {
    return this.authService.register(dto);
  }
}
