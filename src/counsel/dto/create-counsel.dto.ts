import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCounselDto {
  @ApiProperty({ description: '학생 id', example: '10' })
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @ApiProperty({ description: '날짜', example: '2020-02-02' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: '상담제목', example: '진로 상담' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '상담내용', example: '진로에 대해 상담함' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
