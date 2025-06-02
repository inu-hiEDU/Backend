import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  ParseIntPipe,
  Patch,
  Query,
  Res
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateScoreDto } from './dto/create-score.dto';
import { GetClassScoreDto } from './dto/get-class-score.dto';
import { GetScoreDto } from './dto/get-score.dto';
import { ScoresService } from './score.service';
import { NotificationService } from '../notification/notification.service'; // 알림 서비스 import
import { Response } from 'express';

@ApiTags('성적')
@Controller('api/scores')
export class ScoresController {
  constructor(
    private readonly scoresService: ScoresService,
    private readonly notificationService: NotificationService, // 알림 서비스 주입
  ) {}

  // 과목별 성적 입력 (처음 생성 또는 업데이트)
  @Patch()
  @ApiOperation({ summary: '학생별 성적 생성 및 수정' })
  async createScore(@Body() dto: CreateScoreDto) {
    console.log(dto);
    const result = await this.scoresService.createScore(dto);

    return result;
  }

  // 개별 학생 성적 조회
  @Get()
  @ApiOperation({ summary: '학생별 성적 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  async getStudentScores(@Query() query: GetScoreDto) {
    return this.scoresService.getStudentScore(query);
  }

  // 반 전체 성적 조회
  @Get('classroom')
  @ApiOperation({ summary: '반별 성적 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiQuery({ name: 'grade', type: String, description: '학년' })
  @ApiQuery({ name: 'classroom', type: String, description: '반' })
  @ApiQuery({ name: 'semester', type: String, description: '학기' })
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

  @Get('export')
  async exportStudentScores(@Query('studentId') studentId: number, @Res() res: Response) {
    return this.scoresService.exportStudentScores(studentId, res);
  }

}
