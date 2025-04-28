import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { AttendanceStatus } from '../attendance.entity';

export class CreateAttendanceDto {
  @ApiProperty({ description: '학생 id' , example: '10' })
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @ApiProperty({ description: '날짜' , example: '2020-02-02' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: '출석여부' , example: '지각' })
  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;

  @ApiProperty({ description: '비고' , example: '교통사고로 인한 지각' })
  @IsOptional()
  note?: string;
}
