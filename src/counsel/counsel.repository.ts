import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Counsel } from './counsel.entity';

@Injectable()
export class CounselRepository {
  constructor(
    @InjectRepository(Counsel)
    private readonly repo: Repository<Counsel>,
  ) {}

  async createCounsel(data: Partial<Counsel>) {
    const counsel = this.repo.create(data);
    return this.repo.save(counsel);
  }

  async findByFilter(studentId?: number, startDate?: string, endDate?: string) {
    const qb = this.repo.createQueryBuilder('counsel')
      .leftJoinAndSelect('counsel.student', 'student');

    if (studentId) {
      qb.andWhere('student.id = :studentId', { studentId });
    }

    if (startDate && endDate) {
      qb.andWhere('counsel.date BETWEEN :startDate AND :endDate', { startDate, endDate });
    } else if (startDate) {
      qb.andWhere('counsel.date >= :startDate', { startDate });
    } else if (endDate) {
      qb.andWhere('counsel.date <= :endDate', { endDate });
    }

    return qb.getMany();
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['student'] });
  }

  async updateCounsel(id: number, data: Partial<Counsel>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async deleteCounsel(id: number) {
    return this.repo.delete(id);
  }
}