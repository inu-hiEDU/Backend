import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { User } from '../user/user.entity';
import { UserRole } from '../user/user-role.enum';

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
}
