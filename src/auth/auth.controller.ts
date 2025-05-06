import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from '../login/login.dto';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res): Promise<void> {
    const redirectUrl = this.configService.get('GOOGLE_REDIRECT');
    const failUrl = this.configService.get('GOOGLE_FAIL');
    const jwt: string = req.user.jwt; // JWT 확인
    if (jwt) {
      res.redirect(`${redirectUrl}?token=${jwt}`); // JWT를 쿼리 파라미터로 전달
    } else {
      res.redirect(failUrl);
    }
  }

  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  protectedResource() {
    return 'JWT is working!';
  }

  // swagger newman test용 access token 발급
  @Get('test-token')
  getTestToken() {
    const token = this.authService.createTestToken();
    return { accessToken: token };
  }
}
