import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ description: '학생 id', example: '36' })
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @ApiProperty({ description: '날짜', example: '2020-02-02' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: '과목id', example: '01' })
  @IsInt()
  @IsNotEmpty()
  subject: Number;

  @ApiProperty({ description: '피드백내용', example: '피드백' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '공개여부', example: true })
  @IsBoolean()
  @IsNotEmpty()
  release: boolean;
}