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

import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './student.entity';
import { StudentService } from './student.service';

@ApiTags('학생')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @ApiOperation({ summary: '학생 정보 생성' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiBody({ type: CreateStudentDto })
  async createStudent(@Body() dto: CreateStudentDto) {
    return this.studentService.createStudent(dto);
  }
  
  @Get()
  @ApiOperation({ summary: '학생 전체/학년반별 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiQuery({ name: 'grade', type: String, description: '학년' })
  @ApiQuery({ name: 'class', type: String, description: '반' })
  async getStudents(
    @Query('grade') grade?: number,
    @Query('class') classroom?: number,
  ): Promise<Student[]> {
    if (grade && classroom) {
      return this.studentService.getStudentIdsByGradeAndClassroom(grade, classroom);
    } else {
      return this.studentService.getAllStudents();
    }
  }

  @Get(':id')
  @ApiOperation({ summary: '학생 정보 개별 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiParam({ name: 'id', type: String, description: '학생 id' })
  async getStudent(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.getStudentById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '학생 정보 수정' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiParam({ name: 'id', type: String, description: '학생 id' })
  async updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentService.updateStudent(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '학생 정보 삭제' })
  @ApiResponse({ status: 204, description: '성공' })
  @ApiParam({ name: 'id', type: String, description: '학생 id' })
  @HttpCode(204)
  async deleteStudent(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.deleteStudent(id);
  }
}
