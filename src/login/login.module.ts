import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthController } from './login.controller';
import { Login } from './login.entity';
import { LoginService } from './login.service';

@Module({
  imports: [TypeOrmModule.forFeature([Login])],
  providers: [LoginService],
  // controllers: [AuthController],
  exports: [LoginService],
})
export class LoginModule {}
