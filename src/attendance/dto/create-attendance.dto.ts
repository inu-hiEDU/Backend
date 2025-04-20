import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
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
