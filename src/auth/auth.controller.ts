import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from '../login/login.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt.guard';
import { UserService } from '../user/user.service';
import { AuthRequest } from './auth-request.interface';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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
  async googleLoginCallback(@Req() req: Request, @Res() res: Response): Promise<void> {
    const redirectUrl = this.configService.get<string>('GOOGLE_REDIRECT');
    const failUrl = this.configService.get<string>('GOOGLE_FAIL');
    const jwt: string = (req.user as any)?.jwt || ''; // JWT 확인

    if (jwt) {
      // JWT가 유효한 경우 성공 URL로 리다이렉트
      return res.redirect(`${redirectUrl}?token=${jwt}`);
    } else {
      // JWT가 없으면 실패 URL로 리다이렉트
      return res.redirect(failUrl!);
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

  @Get('check-user')
  async checkUser(@Req() req: Request, @Res() res: Response): Promise<void> {
    const token = req.query.token as string;
    if (!token) {
      return res.redirect(this.configService.get<string>('GOOGLE_FAIL')!);
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(token); // JWT 검증
    } catch (e) {
      console.error('JWT 검증 실패:', e);
      return res.redirect(this.configService.get<string>('GOOGLE_FAIL')!);
    }

    const userId = payload.userId;
    const role = payload.role;
    console.log('🔐 토큰 payload:', payload);

    if (!userId || !role) {
      return res.redirect(this.configService.get<string>('GOOGLE_FAIL')!);
    }

    let exists = false;

    if (role === 'student') {
      exists = await this.userService.isUserInStudentsTable(Number(userId));
    } else if (role === 'teacher') {
      exists = await this.userService.isUserInTeachersTable(Number(userId));
    } else if (role === 'parent') {
      exists = await this.userService.isUserInParentsTable(Number(userId));
    }

   if (exists) {
      return res.redirect(this.configService.get<string>('GOOGLE_REDIRECT')!);
    } else {
      return res.redirect(this.configService.get<string>('GOOGLE_REDIRECT_ADDINFO')!);
    }
  }
}
