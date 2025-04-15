import {
  Controller,
  Patch,
  Body,
  Get,
  Query,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ScoresService } from './score.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { GetScoreDto } from './dto/get-score.dto';
import { GetClassScoreDto } from './dto/get-class-score.dto';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  // 과목별 성적 입력 (처음 생성 또는 업데이트)
  @Patch()
  async createScore(@Body() dto: CreateScoreDto) {
    console.log(dto);
    return this.scoresService.createScore(dto);
  }

  // 개별 학생 성적 조회
  @Get()
  async getStudentScores(@Query() query: GetScoreDto) {
    return this.scoresService.getStudentScore(query);
  }

  // 반 전체 성적 조회
  @Get('class')
  async getClassScores(@Query() query: GetClassScoreDto) {
    return this.scoresService.getClassScore(query);
  }

  // 성적 삭제
  @Delete()
  async deleteScores(
    @Query('studentId', ParseIntPipe) studentId: number,
    @Query('grade', ParseIntPipe) grade: number,
    @Query('semester', ParseIntPipe) semester: number,
  ) {
    return this.scoresService.deleteScore(studentId, grade, semester);
  }
}
