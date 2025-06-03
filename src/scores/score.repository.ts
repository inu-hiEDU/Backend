import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scores } from './score.entity';
import { Student } from '../students/student.entity';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ScoreRepository {
  private key: Buffer;
  private iv: Buffer;
  private readonly algorithm = 'aes-256-cbc';

  constructor(
    @InjectRepository(Scores)
    private readonly scoresRepository: Repository<Scores>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly configService: ConfigService,
  ) {
    this.key = Buffer.from(
      this.configService.get<string>('CRYPTO_KEY')!,
      'hex',
    );
    this.iv = Buffer.from(this.configService.get<string>('CRYPTO_IV')!, 'hex');
  }

  // 암호화
  public encrypt(text: string | number): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    return cipher.update(text.toString(), 'utf8', 'hex') + cipher.final('hex');
  }

  // 복호화
  public decrypt(encrypted: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
  }

  private decryptScoreFields(score: Scores): Scores {
    const fields = [
      'subject1',
      'subject2',
      'subject3',
      'subject4',
      'subject5',
      'subject6',
      'subject7',
      'subject8',
      'totalScore',
      'averageScore',
    ] as const;

    for (const field of fields) {
      const value = (score as any)[field];
      if (typeof value === 'string' && /^[0-9a-f]+$/i.test(value)) {
        // hex 형식인 경우만 decrypt 시도
        try {
          (score as any)[field] = parseFloat(this.decrypt(value));
        } catch {
          (score as any)[field] = Number(value);
        }
      } else if (typeof value === 'number') {
        (score as any)[field] = value;
      }
    }

    return score;
  }

  private encryptScoreFields(score: Scores): Scores {
    const fields = [
      'subject1',
      'subject2',
      'subject3',
      'subject4',
      'subject5',
      'subject6',
      'subject7',
      'subject8',
      'totalScore',
      'averageScore',
    ] as const;

    for (const field of fields) {
      const value = (score as any)[field];
      if (typeof value === 'number') {
        (score as any)[field] = this.encrypt(value);
      }
    }

    return score;
  }

  async saveScore(data: Partial<Scores>): Promise<Scores> {
    const entity = this.scoresRepository.create(data);
    const encrypted = this.encryptScoreFields(entity);
    const saved = await this.scoresRepository.save(encrypted);
    return this.decryptScoreFields(saved);
  }

  async findByStudent(studentId: number): Promise<Scores[]> {
    const scores = await this.scoresRepository.find({
      where: { student: { id: studentId } },
      relations: ['student'],
    });
    return scores.map(this.decryptScoreFields.bind(this));
  }

  async findOneByStudentGradeSemester(
    studentId: number,
    grade: number,
    semester: number,
  ): Promise<Scores | null> {
    const score = await this.scoresRepository.findOne({
      where: { student: { id: studentId }, grade, semester },
      relations: ['student'],
    });
    return score ? this.decryptScoreFields(score) : null;
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
  ): Promise<Scores[]> {
    const scores = await this.scoresRepository.find({
      where: {
        grade,
        semester,
        student: {
          classroom,
        },
      },
      relations: ['student'],
    });
    return scores.map(this.decryptScoreFields.bind(this));
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
