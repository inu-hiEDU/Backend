import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateStudentFromHakbeonDto {
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
