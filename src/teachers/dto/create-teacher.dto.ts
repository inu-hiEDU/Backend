import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({ description: '선생님의 이름' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '전화번호' })
  @IsNotEmpty()
  @IsString()
  phoneNum: string;

  @ApiProperty({ description: '생년월일' })
  @IsNotEmpty()
  @IsString()
  birthday: string;

  @ApiProperty({ description: '사용자 ID (user 테이블의 FK)' })
  @IsNotEmpty()
  @IsNumber()
  userId: number; // user 테이블의 외래 키
}