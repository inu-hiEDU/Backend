import { ApiProperty } from '@nestjs/swagger';

export class CreateScoreDto {
  @ApiProperty({ description: '학생 id', example: '10' })
  studentId: number;

  @ApiProperty({ description: '학년', example: '2' })
  grade: number;

  @ApiProperty({ description: '학기', example: '1' })
  semester: number;

  @ApiProperty({ description: '과목1', example: '10' })
  subject1?: number;

  @ApiProperty({ description: '과목2', example: '10' })
  subject2?: number;

  @ApiProperty({ description: '과목3', example: '10' })
  subject3?: number;

  @ApiProperty({ description: '과목4', example: '10' })
  subject4?: number;

  @ApiProperty({ description: '과목5', example: '10' })
  subject5?: number;

  @ApiProperty({ description: '과목6', example: '10' })
  subject6?: number;

  @ApiProperty({ description: '과목7', example: '10' })
  subject7?: number;

  @ApiProperty({ description: '과목8', example: '10' })
  subject8?: number;
}
