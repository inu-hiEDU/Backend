import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { User } from '../user/user.entity';

@Injectable()
export class StudentRepository {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentRepo.find();
  }

  async findOneById(id: number): Promise<Student> {
    return this.studentRepo.findOneByOrFail({ id });
  }

  async createStudent(dto: Partial<Student>): Promise<Student> {
    const student = this.studentRepo.create(dto);
    return this.studentRepo.save(student);
  }

  async updateStudent(id: number, dto: Partial<Student>): Promise<Student> {
    await this.studentRepo.update(id, dto);
    return this.findOneById(id);
  }

  async deleteStudent(id: number): Promise<void> {
    await this.studentRepo.delete(id);
  }

  async findByGradeAndClassroom(
    grade: number,
    classroom: number,
  ): Promise<Student[]> {
    const students = await this.studentRepo
      .createQueryBuilder('student')
      .where('student.grade = :grade', { grade })
      .andWhere('student.classroom = :classroom', { classroom })
      .getMany();

    return students;
  }

  async createStudentFromHakbeon(data: {
    hakbeon: string;
    name: string;
    phoneNum: string;
    birthday: string;
    userId: number; // User_id
  }): Promise<Student> {
    const { hakbeon, name, phoneNum, birthday, userId } = data;

    // 학번(hakbeon)에서 grade, classroom, studentNum 추출
    const grade = parseInt(hakbeon[0], 10);
    const classroom = parseInt(hakbeon.slice(1, 3), 10);
    const studentNum = parseInt(hakbeon.slice(3), 10);

    // User 엔티티
    const user = await this.studentRepo.manager.findOne(User, {
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }

    // 새로운 학생 생성
    const student = this.studentRepo.create({
      grade,
      classroom,
      studentNum,
      name,
      phoneNum,
      birthday,
      user,
    });

    return this.studentRepo.save(student);
  }
}
