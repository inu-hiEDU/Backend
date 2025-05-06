// src/scores/dto/get-score.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class GetScoreDto {
  @ApiProperty({ description: '학생 id', example: 3 })
  studentId: number;
}
