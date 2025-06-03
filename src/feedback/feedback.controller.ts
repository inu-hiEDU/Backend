import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  Req,
  Res,
  NotFoundException
} from '@nestjs/common';

import { Response } from 'express';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiCreate,
  ApiDelete,
  ApiFind,
  ApiGet,
  ApiUpdate,
} from '../swagger_config';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { AuthGuard } from '@nestjs/passport';

// import { Roles } from '../auth/roles.decorator';
// import { UserRole } from '../user/user-role.enum';

@ApiTags('피드백')
@Controller('api/feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiBearerAuth('teacher')
  @ApiCreate('피드백 정보 생성', CreateFeedbackDto)
  @UseGuards(AuthGuard('jwt'))
  // @Roles(UserRole.TEACHER)
  create(@Body() dto: CreateFeedbackDto, @Req() req) {
    const userId = req.user.userId;
    return this.feedbackService.create(dto, userId);
  }

  @Get()
  @ApiFind('피드백 정보 필터링')
  // @Roles(UserRole.TEACHER)
  findAll(
    @Query('studentId') studentId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.feedbackService.findAll(studentId, startDate, endDate);
  }

  @Get(':id')
  @ApiGet('피드백 정보 개별 조회')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = Number(req.user.userId);
    return this.feedbackService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiUpdate('피드백 정보 수정', UpdateFeedbackDto)
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFeedbackDto,
    @Req() req,
  ) {
    const userId = Number(req.user.userId);
    return this.feedbackService.update(id, dto, userId);
  }

  @Delete(':id')
  @ApiDelete('피드백 정보 삭제')
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = Number(req.user.userId);
    return this.feedbackService.remove(id, userId);
  }

  @Get('export/:studentId')
  async exportFeedbackReport(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Res() res: Response,
  ) {
    try {
      await this.feedbackService.exportFeedbackReport(studentId, res);
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
      }
    }
  }
}
