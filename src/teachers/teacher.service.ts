import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { User } from '../user/user.entity';
import { UserRole } from '../user/user-role.enum';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createTeacher(data: CreateTeacherDto): Promise<Teacher> {
    const { userId, ...teacherData } = data;

    // 1. 선생님 생성
    const teacher = this.teacherRepository.create({ ...teacherData, userId });
    const savedTeacher = await this.teacherRepository.save(teacher);

    // 2. 유저 role을 TEACHER로 업데이트
    await this.userRepository.update(userId, { role: UserRole.TEACHER });

    return savedTeacher;
  }

  async updateTeacher(id: number, dto: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOneBy({ id });
    if (!teacher) {
      throw new NotFoundException('해당 교사를 찾을 수 없습니다.');
    }

    // DTO 필드를 교사 엔티티에 덮어쓰기
    Object.assign(teacher, dto);
    return this.teacherRepository.save(teacher);
  }
}
