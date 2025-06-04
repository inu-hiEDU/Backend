import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Patch,
  Param,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Teacher } from '../teachers/teacher.entity';
import { Student } from '../students/student.entity';
import { StudentService } from 'src/students/student.service';
import { CreateStudentDto } from 'src/students/dto/create-student.dto';

@Controller('/api/admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly studentService: StudentService,
  ) {}

  @Get('teachers')
  getAllTeachers(): Promise<Teacher[]> {
    return this.adminService.getAllTeachers();
  }

  @Post('teachers')
  createTeacher(
    @Body()
    body: {
      name: string;
      phoneNum: string;
      birthday: string;
      userId: number;
    },
  ): Promise<Teacher> {
    return this.adminService.createTeacher(body);
  }

  @Patch('teachers/:id')
  updateTeacher(
    @Param('id') id: string,
    @Body() body: Partial<Teacher>,
  ): Promise<Teacher> {
    return this.adminService.updateTeacher(id, body);
  }

  @Delete('teachers/:id')
  deleteTeacher(@Param('id') id: string): Promise<void> {
    return this.adminService.deleteTeacher(id);
  }

  // 학생 전체 조회
  @Get('students')
  getAllStudents(): Promise<Student[]> {
    return this.studentService.getAllStudents();
  }

  // 학생 등록
  @Post('students')
  createStudent(dto: CreateStudentDto): Promise<Student> {
    return this.studentService.createStudent(dto, 999);
  }

  // 학생 수정
  @Patch('students/:id')
  updateStudent(
    @Param('id') id: number,
    @Body() data: Partial<Student>,
  ): Promise<Student> {
    const dto: CreateStudentDto = {
      studentNum: data.studentNum!,
      name: data.name!,
      grade: data.grade!,
      classroom: data.classroom!,
      phoneNum: data.phoneNum!,
      birthday: data.birthday!,
      userId: data.userId!,
    };
    return this.studentService.updateStudent(id, dto);
  }

  // 학생 삭제
  @Delete('students/:id')
  deleteStudent(@Param('id') id: number): Promise<void> {
    return this.studentService.deleteStudent(id);
  }
}
