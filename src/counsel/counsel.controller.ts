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
import { CounselService } from './counsel.service';
import { CreateCounselDto } from './dto/create-counsel.dto';
import { UpdateCounselDto } from './dto/update-counsel.dto';
// import { Roles } from '../auth/roles.decorator';
// import { UserRole } from '../user/user-role.enum';

@ApiTags('상담')
@Controller('counsels')
export class CounselController {
  constructor(private readonly counselService: CounselService) {}

  @Post()
  @ApiOperation({ summary: '상담 정보 생성' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiBody({ type: CreateCounselDto })
  // @Roles(UserRole.TEACHER)
  create(@Body() dto: CreateCounselDto) {
    return this.counselService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '상담 정보 필터링' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiQuery({ name: 'studenId', type: String, description: '학생 id' })
  @ApiQuery({ name: 'startDate', type: String, description: '시작 날짜' })
  @ApiQuery({ name: 'endDate', type: String, description: '마지막 날짜' })
  // @Roles(UserRole.TEACHER)
  findAll(
    @Query('studentId') studentId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.counselService.findAll(studentId, startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: '상담 정보 개별 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiParam({ name: 'id', type: String, description: '출석정보 id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.counselService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '상담 정보 수정' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiParam({ name: 'id', type: String, description: '출석정보 id' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCounselDto) {
    return this.counselService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '상담 정보 삭제' })
  @ApiResponse({ status: 204, description: '성공' })
  @ApiParam({ name: 'id', type: String, description: '출석정보 id' })
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.counselService.remove(id);
  }
}
