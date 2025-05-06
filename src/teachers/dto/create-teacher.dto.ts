import { IsNotEmpty, IsString } from 'class-validator';
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
}