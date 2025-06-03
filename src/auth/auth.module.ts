import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { TeacherModule } from 'src/teachers/teacher.module';
import { StudentModule } from 'src/students/student.module';
import { ParentModule } from 'src/parents/parent.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule, PassportModule, TeacherModule,StudentModule, ParentModule,],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}