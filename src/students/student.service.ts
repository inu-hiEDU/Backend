import { Injectable } from '@nestjs/common';
import { StudentRepository } from './student.repository';
import { Student } from './student.entity';

@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async getAllStudents(): Promise<Student[]> {
    return this.studentRepository.findAll();
  }
}
