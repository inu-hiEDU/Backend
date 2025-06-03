import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from '../login/login.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    // 사용자 확인
    const user = await this.userService.findUserByEmail(email);
    const isPasswordValid = await bcrypt.compare(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일이 올바르지 않습니다.');
    }

    // JWT 생성
    const payload = { sub: user.id, email: user.email, name: user.name, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    return { accessToken: token };
  }

  createTestToken(): string {
    const payload = {
      sub: '13',
      email: 'test1@gmail.com',
      name: '박기석',
      role: 'TEACHER',
    };

    const secret = this.configService.get('JWT_SECRET');
    const options = { expiresIn: '30d' as const }; // 30일 유효기간

    return jwt.sign(payload, secret, options);
  }
  createTestTokenTeacher(): string {
    const payload = {
      sub: '13',
      email: 'teacher1@gmail.com',
      name: '김선생',
      role: 'TEACHER',
    };

    const secret = this.configService.get('JWT_SECRET');
    const options = { expiresIn: '30d' as const }; // 30일 유효기간

    return jwt.sign(payload, secret, options);
  }
}
