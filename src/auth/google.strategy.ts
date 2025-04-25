import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID, // by .env
      clientSecret: process.env.GOOGLE_SECRET, // by .env
      callbackURL: 'http://localhost:3000/auth/google/callback', // redirection URI
      passReqToCallback: true,
      scope: ['profile', 'email'], // 가져올 정보(여기서 더 가져오기는 힘듬 권한 문제)
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile,
    done: any,
  ) {
    try {
      console.log(profile);

      const jwt = 'placeholderJWT';
      const user = {
        jwt,
      };
      done(null, user);
    } catch (err) {
      console.error(err);
      done(err, false);
    }
  }
}