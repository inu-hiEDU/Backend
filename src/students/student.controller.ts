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
  Query,
} from '@nestjs/common';

import { StudentService } from './student.service';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/user-role.enum';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @Roles(UserRole.TEACHER)
  async getAllStudents(): Promise<Student[]> {
    return this.studentService.getAllStudents();
  }

  @Get('list')
  async getStudentsByGradeAndClass(
    @Query('grade') grade: number,
    @Query('class') classroom: number,
  ) {
    return this.studentService.getStudentIdsByGradeAndClassroom(grade, classroom);
  }

  @Get('my-grade')
  @Roles(UserRole.STUDENT)
  async getMyGrade(@Query('studentId') studentId: number) {
    return this.studentService.getStudentById(studentId);
  }

  @Get('child-grade')
  @Roles(UserRole.PARENT)
  async getChildGrade(@Query('childId') childId: number) {
    return this.studentService.getStudentById(childId);
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
