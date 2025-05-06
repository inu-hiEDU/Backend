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
      const email = emails[0].value; // 구글 이메일
      const name = displayName; // 구글 이름

      // User 테이블에 사용자 저장 또는 업데이트
      let user: User = await this.userService.findUserByEmail(email, name);
      if (!user) {
        user = await this.userService.createUser({
          email,
          name,
          role: UserRole.STUDENT,
        });
      } else {
        // 기존 사용자 이름 업데이트 (필요 시)
        user.name = name;
        await this.userService.updateUser(user);
      }

      const payload = { userId: user.id, email: user.email, role: user.role };
      done(null, payload);
    } catch (err) {
      console.error(err);
      done(err, false);
    }
  }
}
