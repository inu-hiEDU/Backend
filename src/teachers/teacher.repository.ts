import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './teacher.entity';
import { User } from '../user/user.entity';

@Injectable()
export class TeacherRepository {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
  ) {}

  async createTeacher(data: {
    name: string;
    phoneNum: string;
    birthday: string;
    userId: number;
  }): Promise<Teacher> {
    const { name, phoneNum, birthday, userId } = data;

    const user = await this.teacherRepo.manager.findOne(User, {
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const teacher = this.teacherRepo.create({
      name,
      phoneNum,
      birthday,
      user,
    });

    return this.teacherRepo.save(teacher);
  }
}
