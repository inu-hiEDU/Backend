import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scores } from './score.entity';
import { Student } from '../students/student.entity';
import { CreateScoreDto } from './dto/create-score.dto';

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

  async findOneByStudentGradeSemester(studentId: number, grade: number, semester: number) {
    return this.scoresRepository.findOne({
      where: { student: { id: studentId }, grade, semester },
      relations: ['student'],
    });
  }

  async saveScore(score: Scores) {
    return this.scoresRepository.save(score);
  }

  async createScoreEntity(data: Partial<Scores>) {
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
}