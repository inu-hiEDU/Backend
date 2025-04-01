import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { LoginRole } from './login.entity';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(LoginRole)
  role: LoginRole;
}
