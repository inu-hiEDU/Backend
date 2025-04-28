// import { Body, Controller, Post, Res } from '@nestjs/common';
// import { Response } from 'express';
// import * as jwt from 'jsonwebtoken';
// import { CreateUserDto } from './create-user.dto';
// import { LoginDto } from './login.dto';
// import { LoginService } from './login.service';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly LoginService: LoginService) {}

//   @Post('register')
//   async register(@Body() dto: CreateUserDto) {
//     const user = await this.LoginService.register(dto);
//     return { message: '회원가입 성공', user };
//   }

//   @Post('login')
//   async login(
//     @Body() dto: LoginDto,
//     @Res({ passthrough: true }) res: Response,
//   ) {
//     const user = await this.LoginService.validateUser(dto.email, dto.password);
//     const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });

//     res.cookie('auth_token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//     });

//     return { message: '로그인 성공' };
//   }

//   @Post('logout')
//   logout(@Res({ passthrough: true }) res: Response) {
//     res.clearCookie('auth_token');
//     return { message: '로그아웃 성공' };
//   }
// }
