import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { AttendanceStatus } from '../attendance.entity';

export class UpdateAttendanceDto {
  @IsInt()
  @IsOptional()
  studentId?: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;

  @IsOptional()
  note?: string;
}
