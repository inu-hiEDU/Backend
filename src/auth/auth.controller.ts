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
import { error } from 'console';

import { TeacherRepository } from '../teachers/teacher.repository';
import { StudentRepository } from 'src/students/student.repository';
import { ParentRepository } from 'src/parents/parent.repository';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly teacherRepository: TeacherRepository,
    private readonly studentRepository: StudentRepository,
    private readonly parentRepository: ParentRepository,
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
  async googleLoginCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
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
  async checkUser(@Req() req: Request): Promise<{ exists: boolean }> {
    const token = req.query.token as string;
    if (!token) {
      throw new Error('토큰 없음');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(token);
      console.log('✅ 토큰 payload:', payload);
    } catch (e) {
      console.error('❌ JWT 검증 실패:', e);
      throw new Error('토큰 오류');
    }

    const userId = payload.sub;
    const role = payload.role;

    if (!userId || !role) {
      throw new Error('유효하지 않은 토큰');
    }

    let exists = false;

    if (role === 'student') {
      exists = await this.userService.isUserInStudentsTable(userId);
    } else if (role === 'teacher') {
      exists = await this.userService.isUserInTeachersTable(userId);
    } else if (role === 'parent') {
      exists = await this.userService.isUserInParentsTable(userId);
    }

    return { exists };
  }

  @Get('userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('teacher')
  async getCurrentUser(@Req() req: AuthRequest): Promise<any> {
    const user = req.user;

    const userInfo = {
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    console.log(userInfo);

    const userId = Number(user.userId); // 모든 역할에서 사용하므로 공통 처리

    if (user.role === 'teacher') {
      const teacher = await this.teacherRepository.findByUserId(userId);
      if (teacher) {
        return { ...userInfo, teacherInfo: teacher };
      }
    }

    if (user.role === 'student') {
      const student = await this.studentRepository.findByUserId(userId);
      if (student) {
        return { ...userInfo, studentInfo: student };
      }
    }

    if (user.role === 'parent') {
      const parent = await this.parentRepository.findByUserId(userId);
      if (parent) {
        return { ...userInfo, parentInfo: parent };
      }
    }

    return userInfo;
  }
}
