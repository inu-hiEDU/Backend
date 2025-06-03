import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scores } from './score.entity';
import { Student } from '../students/student.entity';

@Injectable()
export class ScoreRepository {
  constructor(
    @InjectRepository(Scores)
    private readonly scoresRepository: Repository<Scores>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async findByStudent(studentId: number) {
    return this.scoresRepository.find({
      where: { student: { id: studentId } },
      relations: ['student'],
    });
  }

  async findOneByStudentGradeSemester(
    studentId: number,
    grade: number,
    semester: number,
  ) {
    return this.scoresRepository.findOne({
      where: { student: { id: studentId }, grade, semester },
      relations: ['student'],
    });
  }

  async saveScore(score: Scores) {
    return this.scoresRepository.save(score);
  }

  createScoreEntity(data: Partial<Scores>) {
    return this.scoresRepository.create(data);
  }

  async deleteScore(studentId: number, grade: number, semester: number) {
    return this.scoresRepository.delete({
      student: { id: studentId },
      grade,
      semester,
    });
  }

  async findStudentsByGradeAndClassroom(grade: number, classroom: number) {
    return this.studentRepository.find({
      where: { grade, classroom },
    });
  }
  async findScoresByGradeSemesterClassroom(
    grade: number,
    semester: number,
    classroom: number,
  ) {
    return this.scoresRepository.find({
      where: {
        grade,
        semester,
        student: {
          classroom,
        },
      },
      relations: ['student'],
    });
  }

  async findStudentOrFail(studentId: number) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('해당 학생을 찾을 수 없습니다.');
    }
    return student;
  }
}
