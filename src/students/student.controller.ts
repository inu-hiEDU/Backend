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
  UseGuards,
  Req,
} from '@nestjs/common';

import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiCreate, ApiDelete, ApiGet, ApiUpdate } from '../swagger_config';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './student.entity';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AuthRequest } from '../auth/auth-request.interface';

@ApiTags('학생')
@Controller('api/students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // JWT 인증 활성화
  @ApiCreate('학생 정보 생성', CreateStudentDto)
  async createStudent(
    @Body() dto: CreateStudentDto,
    @Req() req: AuthRequest,
  ): Promise<Student> {
    const userId = Number(req.user.userId);
    if (isNaN(userId)) {
      throw new Error('Invalid userId');
    }

    return this.studentService.createStudent(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: '학생 전체/학년반별 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiQuery({
    name: 'grade',
    required: false,
    type: String,
    description: '학년',
  })
  @ApiQuery({
    name: 'classroom',
    required: false,
    type: String,
    description: '반',
  })
  async getStudents(
    @Query('grade') grade?: number,
    @Query('classroom') classroom?: number,
  ): Promise<Student[]> {
    if (grade && classroom) {
      return this.studentService.getStudentIdsByGradeAndClassroom(
        grade,
        classroom,
      );
    } else {
      return this.studentService.getAllStudents();
    }
  }

  @Get('my-grade')
  async getMyGrade(@Query('studentId') studentId: number) {
    return this.studentService.getStudentById(studentId);
  }

  @Get('child-grade')
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
