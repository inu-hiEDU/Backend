import {
    IsEnum,
    IsOptional,
    IsString,
    IsDateString,
    IsInt,
} from 'class-validator';
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

  @IsString()
  @IsOptional()
  note?: string;
}