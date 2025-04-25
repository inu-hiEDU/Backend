import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  HttpCode
} from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@ApiTags('출석')
@Controller('attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiOperation({ summary: '출석 정보 생성' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiBody({ type: CreateAttendanceDto })
  create(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '출석 정보 핉터링' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiQuery({ name: 'studenId', type: String, description: '학생 id' })
  @ApiQuery({ name: 'startDate', type: String, description: '시작 날짜' })
  @ApiQuery({ name: 'endDate', type: String, description: '마지막 날짜' })
  findAll(
    @Query('studentId') studentId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.findAll(studentId, startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: '출석 정보 개별 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiParam({ name: 'id', type: String, description: '출석정보 id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '출석 정보 수정' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiParam({ name: 'id', type: String, description: '출석정보 id' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '출석 정보 삭제' })
  @ApiResponse({ status: 204, description: '성공' })
  @ApiParam({ name: 'id', type: String, description: '출석정보 id' })
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.remove(id);
  }
}
