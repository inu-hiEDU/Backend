import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
} from 'class-validator';

export class UpdateCounselDto {
  @IsInt()
  @IsOptional()
  studentId?: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
