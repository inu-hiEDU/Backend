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
} from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import {
  ApiCreate,
  ApiDelete,
  ApiFind,
  ApiGet,
  ApiUpdate,
} from '../swagger_config';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@ApiTags('출석')
@Controller('api/attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiCreate('출석 정보 생성', CreateAttendanceDto)
  create(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '출석 정보 필터링' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiQuery({
    name: 'studentId',
    type: Number,
    description: '학생 id',
    required: false,
  })
  @ApiQuery({
    name: 'grade',
    type: Number,
    description: '학년',
    required: false,
  })
  @ApiQuery({
    name: 'classroom',
    type: Number,
    description: '반',
    required: false,
  })
  @ApiQuery({
    name: 'startDate',
    type: String,
    description: '시작 날짜 (YYYY-MM-DD)',
    required: false,
  })
  @ApiQuery({
    name: 'endDate',
    type: String,
    description: '마지막 날짜 (YYYY-MM-DD)',
    required: false,
  })
  findAll(
    @Query('studentId') studentId?: number,
    @Query('grade') grade?: number,
    @Query('classroom') classroom?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.findAll(
      studentId,
      grade,
      classroom,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  @ApiGet('출석 정보 개별 조회')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.findOne(id);
  }

  @Patch(':id')
  @ApiUpdate('출석 정보 수정', UpdateAttendanceDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(id, dto);
  }

  @Delete(':id')
  @ApiDelete('출석 정보 삭제')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.remove(id);
  }
}
