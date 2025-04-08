import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './attendance.entity';

@Injectable()
export class AttendanceRepository {
  constructor(
    @InjectRepository(Attendance)
    private readonly repo: Repository<Attendance>,
  ) {}

  async createAttendance(data: Partial<Attendance>) {
    const attendance = this.repo.create(data);
    return this.repo.save(attendance);
  }

  async findAll() {
    return this.repo.find({ relations: ['student'] });
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['student'] });
  }

  async updateAttendance(id: number, data: Partial<Attendance>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async deleteAttendance(id: number) {
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
