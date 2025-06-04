import { Injectable } from '@nestjs/common';
import { TeacherRepository } from '../teachers/teacher.repository';
import { Teacher } from '../teachers/teacher.entity';
import { Student } from '../students/student.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    private readonly teacherRepository: TeacherRepository,
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
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

  async getAllStudents(): Promise<Student[]> {
    return this.studentRepo.find();
  }

  async createStudent(data: Partial<Student>): Promise<Student> {
    // studentNum 마지막 2자리 추출
    let parsedStudentNum: number | undefined;
    if (data.studentNum) {
      parsedStudentNum = parseInt(String(data.studentNum).slice(-2), 10);
    }

    const student = this.studentRepo.create({
      ...data,
      studentNum: parsedStudentNum,
      classroom: data.classroom ?? (data as any).class, // 안전하게 처리
    });

    return await this.studentRepo.save(student);
  }

  async updateStudent(id: number, data: Partial<Student>): Promise<Student> {
    await this.studentRepo.update(id, {
      ...data,
      classroom: data.classroom ?? (data as any).class,
    });
    return await this.studentRepo.findOneByOrFail({ id });
  }

  async deleteStudent(id: number): Promise<void> {
    await this.studentRepo.delete(id);
  }
}
