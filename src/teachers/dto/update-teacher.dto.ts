import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

class UpdateTeacherBaseDto {
  @ApiProperty({ description: '과목 번호', example: 1, required: false })
  @IsInt()
  @IsOptional()
  subject?: number;

  @ApiProperty({ description: '학년', example: 3, required: false })
  @IsInt()
  @IsOptional()
  grade?: number;

  @ApiProperty({ description: '담임 반', example: 2, required: false })
  @IsInt()
  @IsOptional()
  homeroom?: number;
}

export class UpdateTeacherDto extends PartialType(UpdateTeacherBaseDto) {}
