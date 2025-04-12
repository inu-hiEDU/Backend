import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CounselService } from './counsel.service';
import { CreateCounselDto } from './dto/create-counsel.dto';
import { UpdateCounselDto } from './dto/update-counsel.dto';

@Controller('counsels')
export class CounselController {
  constructor(private readonly counselService: CounselService) {}

  @Post()
  create(@Body() dto: CreateCounselDto) {
      return this.counselService.create(dto);
  }

  @Get()
  findAll(
      @Query('studentId') studentId?: number,
      @Query('startDate') startDate?: string,
      @Query('endDate') endDate?: string,
  ) {
      if (studentId && startDate && endDate) {
          return this.counselService.findByStudentAndRange(studentId, startDate, endDate);
      }
      return this.counselService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
      return this.counselService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCounselDto) {
      return this.counselService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
      return this.counselService.remove(id);
  }
}
