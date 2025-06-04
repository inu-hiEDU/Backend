import { IsOptional, IsString } from 'class-validator';

export class UpdateParentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phoneNum?: string;
}
