import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './student.entity';
import { StudentRepository } from './student.repository';

@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async getAllStudents(): Promise<Student[]> {
    return this.studentRepository.findAll();
  }

  async getStudentById(id: number): Promise<Student> {
    return this.studentRepository.findOneById(id);
  }

  async createStudent(dto: CreateStudentDto): Promise<Student> {
    return this.studentRepository.createStudent(dto);
  }

  async updateStudent(id: number, dto: UpdateStudentDto): Promise<Student> {
    return this.studentRepository.updateStudent(id, dto);
  }

  async deleteStudent(id: number): Promise<void> {
    return this.studentRepository.deleteStudent(id);
  }

  async getStudentIdsByGradeAndClassroom(
    grade: number,
    classroom: number,
  ): Promise<Student[]> {
    return this.studentRepository.findByGradeAndClassroom(grade, classroom);
  }
  
}
