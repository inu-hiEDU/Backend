import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
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

  async findAll() {
    return this.repo.find({ relations: ['student'] });
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

  async findByStudentAndDateRange(studentId: number, startDate: string, endDate: string) {
    return this.repo.find({
      where: {
        student: { id: studentId },
        date: Between(startDate, endDate),
      },
      relations: ['student'],
    });
  }
}
