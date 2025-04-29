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
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './student.entity';
import { StudentService } from './student.service';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/user-role.enum';
import { ApiCreate, ApiGet, ApiUpdate, ApiDelete } from '../swagger_config';
import { CreateAttendanceDto } from 'src/attendance/dto/create-attendance.dto';

@ApiTags('학생')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @ApiCreate('학생 정보 생성', CreateAttendanceDto)
  async createStudent(@Body() dto: CreateStudentDto) {
    return this.studentService.createStudent(dto);
  }
  
  @Get()
  @ApiOperation({ summary: '학생 전체/학년반별 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiQuery({ name: 'grade', required: false, type: String, description: '학년' })
  @ApiQuery({ name: 'class', required: false, type: String, description: '반' })
  // @Roles(UserRole.TEACHER)
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

  @Get(':id')
  @ApiGet('학생 정보 개별 조회')
  async getStudent(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.getStudentById(id);
  }

  @Patch(':id')
  @ApiUpdate('학생 정보 수정', UpdateStudentDto)
  async updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentService.updateStudent(id, dto);
  }

  @Delete(':id')
  @ApiDelete('학생 정보 삭제')
  @HttpCode(204)
  async deleteStudent(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.deleteStudent(id);
  }
}
