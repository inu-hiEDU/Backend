import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedback.entity';

@Injectable()
export class FeedbackRepository {
  constructor(
    @InjectRepository(Feedback)
    private readonly repo: Repository<Feedback>,
  ) {}

  async createFeedback(data: Partial<Feedback>) {
    const feedback = this.repo.create(data);
    return this.repo.save(feedback);
  }

  async findByFilter(studentId?: number, startDate?: string, endDate?: string) {
    const qb = this.repo
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.student', 'student');

    if (studentId) {
      qb.andWhere('student.id = :studentId', { studentId });
    }

    if (startDate && endDate) {
      qb.andWhere('feedback.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      qb.andWhere('feedback.date >= :startDate', { startDate });
    } else if (endDate) {
      qb.andWhere('feedback.date <= :endDate', { endDate });
    }

    return qb.getMany();
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['student'] });
  }

  async updateFeedback(id: number, data: Partial<Feedback>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async deleteFeedback(id: number) {
    return this.repo.delete(id);
  }
}
