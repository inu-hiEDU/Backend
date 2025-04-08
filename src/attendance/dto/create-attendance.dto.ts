import {
    IsEnum,
    IsNotEmpty,
    IsString,
    IsDateString,
    IsOptional,
    IsInt,
} from 'class-validator';
import { AttendanceStatus } from '../attendance.entity';
  
export class CreateAttendanceDto {
  @IsInt()
  @IsNotEmpty()
  studentId: number; // 엔티티의 'student' 대신 사용하는 참조용 필드

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;

  @IsString()
  @IsOptional()
  note?: string;
}
  