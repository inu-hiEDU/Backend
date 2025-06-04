import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStudentFromHakbeonDto {
  @IsNotEmpty()
  @IsNumber()
  studentNum: number; // studentNum

  @IsNotEmpty()
  @IsString()
  hakbeon: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phoneNum: string;

  @IsNotEmpty()
  @IsString()
  birthday: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
