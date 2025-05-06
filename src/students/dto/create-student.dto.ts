import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ description: '학번', example: 2025001 })
  @IsNotEmpty()
  @IsNumber()
  studentNum: number; // 타입을 number로 변경

  @ApiProperty({ description: '이름', example: '홍길동' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '전화번호', example: '010-1234-5678' })
  @IsNotEmpty()
  @IsString()
  phoneNum: string;

  @ApiProperty({ description: '생년월일', example: '2000-01-01' })
  @IsNotEmpty()
  @IsString()
  birthday: string;
}
