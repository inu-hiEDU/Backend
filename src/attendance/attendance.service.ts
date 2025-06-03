import { Injectable } from '@nestjs/common';
import { AttendanceRepository } from './attendance.repository';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  create(dto: CreateAttendanceDto) {
    return this.attendanceRepository.createAttendance({
      student: { id: dto.studentId } as any,
      date: new Date(dto.date), // ← 여기!
      status: dto.status,
      note: dto.note,
    });
  }

  findAll(
    studentId?: number,
    grade?: number,
    classroom?: number,
    startDate?: string,
    endDate?: string,
  ) {
    return this.attendanceRepository.findByFilter(
      studentId,
      grade,
      classroom,
      startDate,
      endDate,
    );
  }

  findOne(id: number) {
    return this.attendanceRepository.findById(id);
  }

  update(id: number, dto: UpdateAttendanceDto) {
    const data: any = { ...dto };
    if (dto.date) {
      data.date = new Date(dto.date);
    }
    if (dto.studentId) {
      data.student = { id: dto.studentId } as any;
      delete data.studentId;
    }
    return this.attendanceRepository.updateAttendance(id, data);
  }

  remove(id: number) {
    return this.attendanceRepository.deleteAttendance(id);
  }
}
