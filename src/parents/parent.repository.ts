import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from './parent.entity';
import { Student } from '../students/student.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ParentRepository {
  constructor(
    @InjectRepository(Parent)
    private readonly parentRepo: Repository<Parent>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  /**
   * 학부모 생성
   */
  async createParent(data: {
    name: string;
    studentNum: string;
    phoneNum: string;
    userId: number;
  }): Promise<Parent> {
    const { name, studentNum, phoneNum, userId } = data;

    const user = await this.parentRepo.manager.findOne(User, {
      where: { id: userId },
    });
    if (!user) throw new Error('User not found');

    const student = await this.studentRepo.findOne({
      where: { studentNum: parseInt(studentNum, 10) },
    });
    if (!student) throw new Error('Student not found');

    const parent = this.parentRepo.create({
      name,
      phoneNum,
      user,
      student,
    });

    return this.parentRepo.save(parent);
  }

  /**
   * 전체 학부모 조회
   */
  async findAll(): Promise<Parent[]> {
    return this.parentRepo.find({
      relations: ['student', 'user'],
    });
  }

  /**
   * ID로 학부모 조회
   */
  async findOneById(id: number): Promise<Parent | null> {
    return this.parentRepo.findOne({
      where: { id },
      relations: ['student', 'user'],
    });
  }

  /**
   * 학부모 수정
   */
  async updateParent(id: number, data: Partial<Parent>): Promise<Parent> {
    const parent = await this.findOneById(id);
    if (!parent) throw new Error('Parent not found');

    Object.assign(parent, data);
    return this.parentRepo.save(parent);
  }

  /**
   * 학부모 삭제
   */
  async deleteParent(id: number): Promise<{ deleted: boolean }> {
    const result = await this.parentRepo.delete(id);
    return { deleted: (result.affected ?? 0) > 0 };
  }

  /**
   * 유저 ID로 학부모 조회
   */
  async findByUserId(userId: number): Promise<Parent | null> {
    return await this.parentRepo.findOne({
      where: { user: { id: userId } },
      relations: ['student', 'user'],
    });
  }
}
