import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';

import { StudentService } from './student.service';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async getAllStudents(): Promise<Student[]> {
    return this.studentService.getAllStudents();
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
