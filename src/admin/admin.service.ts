import { Injectable } from '@nestjs/common';
import { TeacherRepository } from '../teachers/teacher.repository';
import { Teacher } from '../teachers/teacher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    private readonly teacherRepository: TeacherRepository,
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
  ) {}

  getAllTeachers(): Promise<Teacher[]> {
    return this.teacherRepo.find({ relations: ['user'] });
  }

  createTeacher(data: {
    name: string;
    phoneNum: string;
    birthday: string;
    userId: number;
  }): Promise<Teacher> {
    return this.teacherRepository.createTeacher(data);
  }

  async updateTeacher(
    id: string,
    updateData: Partial<Teacher>,
  ): Promise<Teacher> {
    const teacher = await this.teacherRepo.findOneOrFail({
      where: { id: Number(id) },
    });
    Object.assign(teacher, updateData);
    return this.teacherRepo.save(teacher);
  }

  async deleteTeacher(id: string): Promise<void> {
    await this.teacherRepo.delete(id);
  }
}
