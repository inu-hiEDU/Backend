import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import { UserRole } from '../user-role.enum';

export class CreateUserDto {
  @ApiProperty({ description: '사용자 이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '사용자 이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '사용자 비밀번호', required: false })
  @IsOptional()
  @IsString()
  password?: string; // 선택적 속성으로 변경

  @ApiProperty({ description: '사용자 역할', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;
}
