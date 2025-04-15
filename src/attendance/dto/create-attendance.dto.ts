import { IsEnum, IsNotEmpty, IsDateString, IsOptional, IsInt } from 'class-validator';
import { AttendanceStatus } from '../attendance.entity';

export class CreateAttendanceDto {
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;

  @IsOptional()
  note?: string;
}