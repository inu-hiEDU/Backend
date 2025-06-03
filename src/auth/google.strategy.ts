import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { UserRole } from '../user/user-role.enum';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    try {
      console.log('✅ Google profile:', profile);

      const email = profile?.emails?.[0]?.value;
      const name = profile?.displayName;

      if (!email) {
        throw new Error('❌ 이메일 정보 없음 (profile.emails)');
      }

      console.log('✅ 이메일:', email);
      console.log('✅ 이름:', name);

      // 사용자 조회 또는 생성
      let user: User = await this.userService.findUserByEmail(email, name);
      if (!user) {
        user = await this.userService.createUser({
          email,
          name,
          role: UserRole.STUDENT,
        });
        console.log('✅ 신규 유저 생성:', user);
      } else {
        user.name = name;
        await this.userService.updateUser(user);
        console.log('✅ 기존 유저 업데이트:', user);
      }

      // JWT 생성
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('❌ JWT_SECRET이 설정되지 않음');
      }

      const payload = { sub: user.id, email: user.email, name: user.name, role: user.role };
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });

      console.log('✅ JWT payload:', payload);
      console.log('✅ JWT token:', token);

      done(null, { ...payload, jwt: token });
    } catch (err) {
      console.error('❌ GoogleStrategy validate() 실패:', err);
      done(err, false);
    }
  }
}