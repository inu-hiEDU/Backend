import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from './parent.entity';
import { User } from '../user/user.entity';
import { Student } from '../students/student.entity';

@Injectable()
export class ParentRepository {
  constructor(
    @InjectRepository(Parent)
    private readonly parentRepo: Repository<Parent>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  async createParent(data: {
    name: string;
    studentNum: string;
    phoneNum: string;
    userId: number;
  }): Promise<Parent> {
    const { name, studentNum, phoneNum, userId } = data;

    // User 엔티티 조회
    const user = await this.parentRepo.manager.findOne(User, { where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Student 엔티티 조회
    const student = await this.studentRepo.findOne({ where: { studentNum: parseInt(studentNum, 10) } });
    if (!student) {
      throw new Error('Student not found');
    }

    // Parent 엔티티 생성
    const parent = this.parentRepo.create({
      name,
      phoneNum,
      user,
      student, // Student와 관계 설정
    });

    return this.parentRepo.save(parent);
  }

  async findByUserId(userId: number): Promise<Parent | null> {
    return await this.parentRepo.findOne({
      where: { user: { id: userId } }
    });
  }
}