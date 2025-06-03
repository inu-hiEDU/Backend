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
} from '@nestjs/common';

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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.feedbackService.findOne(id);
  }

  @Patch(':id')
  @ApiUpdate('피드백 정보 수정', UpdateFeedbackDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFeedbackDto,
  ) {
    return this.feedbackService.update(id, dto);
  }

  @Delete(':id')
  @ApiDelete('피드백 정보 삭제')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.feedbackService.remove(id);
  }
}
