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

import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './student.entity';
import { StudentService } from './student.service';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async getAllStudents(): Promise<Student[]> {
    return this.studentService.getAllStudents();
  }
  @Get('list')
  async getStudentsByGradeAndClass(
    @Query('grade') grade: number,
    @Query('class') classroom: number,
  ) {
    return this.studentService.getStudentIdsByGradeAndClassroom(
      grade,
      classroom,
    );
  }
}

@Controller('students/info')
export class StudentInfoController {
  constructor(private readonly studentService: StudentService) {}
  @Get(':id')
  async getStudent(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.getStudentById(id);
  }

  @Post()
  async createStudent(@Body() dto: CreateStudentDto) {
    return this.studentService.createStudent(dto);
  }

  @Patch(':id')
  async updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentService.updateStudent(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteStudent(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.deleteStudent(id);
  }
}
