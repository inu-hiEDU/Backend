import { Injectable } from '@nestjs/common';
import { TeacherRepository } from './teacher.repository';
import { Teacher } from './teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(private readonly teacherRepository: TeacherRepository) {}

  async createTeacher(data: CreateTeacherDto & { userId: number }): Promise<Teacher> {
    return this.teacherRepository.createTeacher(data);
  }
}