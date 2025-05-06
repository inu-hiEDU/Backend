import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParentDto {
  @ApiProperty({ description: '학부모 이름' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '학생 번호' })
  @IsNotEmpty()
  @IsString()
  studentNum: string;

  @ApiProperty({ description: '전화번호' })
  @IsNotEmpty()
  @IsString()
  phoneNum: string;
}