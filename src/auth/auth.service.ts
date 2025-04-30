import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { LoginDto } from '../login/login.dto';
import { ConfigService } from '@nestjs/config';

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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // JWT 생성
    const payload = { sub: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return { accessToken: token };
  }

  createTestToken(): string {
    const payload = {
      sub: 'test-user-id',
      email: 'test1@gmail.com',
      name: '박기석',
      role: 'teacher'
    };

    const secret = this.configService.get('JWT_SECRET');
    const options = { expiresIn: '30d' as const}; // 30일 유효기간

    return jwt.sign(payload, secret, options);
  }
}