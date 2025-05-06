import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { Teacher } from './teacher.entity';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AuthRequest } from '../auth/auth-request.interface';

@ApiTags('선생님')
@Controller('teachers')
@UseGuards(JwtAuthGuard)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @ApiOperation({ summary: '선생님 등록' })
  @ApiBody({ type: CreateTeacherDto })
  @Post()
  async createTeacher(
    @Body() data: CreateTeacherDto,
    @Req() req: AuthRequest,
  ): Promise<Teacher> {
    const userId = Number(req.user.userId); // userId를 number로 변환
    if (isNaN(userId)) {
      throw new Error('Invalid userId');
    }
    return this.teacherService.createTeacher({ ...data, userId });
  }
}