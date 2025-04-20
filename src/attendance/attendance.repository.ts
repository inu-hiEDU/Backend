import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findByFilter(studentId?: number, startDate?: string, endDate?: string) {
    const qb = this.repo
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.student', 'student');

    if (studentId) {
      qb.andWhere('student.id = :studentId', { studentId });
    }

    if (startDate && endDate) {
      qb.andWhere('attendance.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      qb.andWhere('attendance.date >= :startDate', { startDate });
    } else if (endDate) {
      qb.andWhere('attendance.date <= :endDate', { endDate });
    }

    return qb.getMany();
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

  async findAll() {
    return this.repo.find({ relations: ['student'] });
  }
}
