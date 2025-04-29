import { Controller, Get, UseGuards, Res, Req, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from '../login/login.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<void> {
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res): Promise<void> {
    const redirectUrl = this.configService.get('GOOGLE_REDIRECT');
    const jwt: string = req.user.jwt;
    if (jwt) res.redirect(redirectUrl);
    else res.redirect('http://localhost:3000/login/failure');
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