import { Controller, Post, Body, Param, Get, Put, Delete } from '@nestjs/common';
import { CounselService } from './counsel.service';
import { CreateCounselDto } from './dto/create-counsel.dto';
import { UpdateCounselDto } from './dto/update-counsel.dto';

@Controller('counsels')
export class CounselController {
  constructor(private readonly counselService: CounselService) {}

  // 상담 내역 생성
  @Post()
  async create(@Body() createCounselDto: CreateCounselDto) {
    return this.counselService.create(createCounselDto);  // POST 메서드
  }

  // 모든 상담 내역 조회
  @Get()
  async findAll() {
    return this.counselService.findAll();  // GET 처리
  }

  // 특정 상담 내역 조회
  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.counselService.findById(id);  // GET 처리
  }

  // 상담 내역 업데이트
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateCounselDto: UpdateCounselDto) {
    return this.counselService.update(id, updateCounselDto);  // PUT/PATCH 처리
  }

  // 상담 내역 삭제
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.counselService.remove(id);  // DELETE 처리
  }

  // 학생 ID와 날짜 범위로 상담 내역 조회
  @Get('student/:studentId')
  async findByStudentAndDateRange(
    @Param('studentId') studentId: number,
    @Body('startDate') startDate: string,
    @Body('endDate') endDate: string
  ) {
    return this.counselService.findByStudentAndDateRange(studentId, startDate, endDate);
  }
}
