import { IsNotEmpty, IsDateString, IsInt, IsString } from 'class-validator';

export class CreateCounselDto {
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}