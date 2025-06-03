import { Body, Controller, Post, Req, UseGuards, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { Teacher } from './teacher.entity';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AuthRequest } from '../auth/auth-request.interface';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@ApiTags('선생님')
@Controller('api/teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @ApiOperation({ summary: '선생님 등록' })
  @ApiBody({ type: CreateTeacherDto })
  @UseGuards(JwtAuthGuard) // JWT 인증 활성화
  @Post()
  async createTeacher(
    @Body() data: CreateTeacherDto,
    @Req() req: AuthRequest,
  ): Promise<Teacher> {
    // JWT에서 userId 가져오기
    const userId = Number(req.user.userId);
    if (isNaN(userId)) {
      throw new Error('Invalid userId');
    }

    // userId를 CreateTeacherDto에 추가
    return this.teacherService.createTeacher({ ...data, userId });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTeacherDto,
  ) {
    return this.teacherService.updateTeacher(id, dto);
  }
}
