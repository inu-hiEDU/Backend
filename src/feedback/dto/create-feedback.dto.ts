import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ description: '학생 id', example: '10' })
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @ApiProperty({ description: '날짜', example: '2020-02-02' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: '피드백 과목', example: '01' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ description: '피드백 내용', example: '진로에 대해 피드백함' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '공개여부', example: true })
  @IsBoolean()
  @IsNotEmpty()
  release: boolean;

}
