import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async createTeacher(data: CreateTeacherDto): Promise<Teacher> {
    // CreateTeacherDto에서 userId 포함
    const teacher = this.teacherRepository.create(data);
    return this.teacherRepository.save(teacher);
  }
}