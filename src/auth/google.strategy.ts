import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { UserRole } from '../user/user-role.enum';

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
      const { emails, displayName } = profile;
      const email = emails[0].value;
      const name = displayName;

      // User 테이블에 사용자 저장 또는 업데이트
      let user: User = await this.userService.findUserByEmail(email);
      if (!user) {
        user = await this.userService.createUser({
          email,
          name,
          password: '', // 소셜 로그인 사용자는 비밀번호가 필요 없음
          role: UserRole.TEACHER, // 기본 역할 설정
        });
      }

      const payload = { userId: user.id, email: user.email, role: user.role };
      done(null, payload);
    } catch (err) {
      console.error(err);
      done(err, false);
    }
  }
}
