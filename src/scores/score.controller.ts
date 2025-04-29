import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Query,
  HttpCode
} from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { GetClassScoreDto } from './dto/get-class-score.dto';
import { GetScoreDto } from './dto/get-score.dto';
import { ScoresService } from './score.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ApiGet, ApiUpdate} from '../swagger_config';

@ApiTags('성적')
@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  // 과목별 성적 입력 (처음 생성 또는 업데이트)
  @Patch()
  @ApiUpdate('성적 정보 생성 및 수정', CreateScoreDto)
  async createScore(@Body() dto: CreateScoreDto) {
    console.log(dto);
    return this.scoresService.createScore(dto);
  }

  // 개별 학생 성적 조회
  @Get()
  @ApiGet('성적 학생별 조회')
  async getStudentScores(@Query() query: GetScoreDto) {
    return this.scoresService.getStudentScore(query);
  }

  // 반 전체 성적 조회
  @Get('class')
  @ApiOperation({ summary: '성적 반별 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiQuery({ name: 'grade', type: String, description: '학년' })
  @ApiQuery({ name: 'semester', type: String, description: '학기' })
  @ApiQuery({ name: 'class', type: String, description: '반' })
  async getClassScores(@Query() query: GetClassScoreDto) {
    return this.scoresService.getClassScore(query);
  }

  // 성적 삭제
  @Delete()
  @ApiOperation({ summary: '성적 삭제' })
  @ApiResponse({ status: 204, description: '성공' })
  @ApiQuery({ name: 'studentId', type: String, description: '학생 id' })
  @ApiQuery({ name: 'grade', type: String, description: '학년' })
  @ApiQuery({ name: 'semester', type: String, description: '학기' })
  @HttpCode(204)
  async deleteScores(
    @Query('studentId', ParseIntPipe) studentId: number,
    @Query('grade', ParseIntPipe) grade: number,
    @Query('semester', ParseIntPipe) semester: number,
  ) {
    return this.scoresService.deleteScore(studentId, grade, semester);
  }
}
