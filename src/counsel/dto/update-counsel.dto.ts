import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateCounselDto {
  @IsInt()
  @IsOptional()
  studentId?: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  content?: string;
}
