import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login } from './login.entity';
import { LoginService } from './login.service';
import { AuthController } from './login.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Login])],
  providers: [LoginService],
  controllers: [AuthController],
  exports: [LoginService],
})
export class LoginModule {}
