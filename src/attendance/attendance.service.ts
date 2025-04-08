import { Injectable } from '@nestjs/common';
import { AttendanceRepository } from './attendance.repository';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  create(dto: CreateAttendanceDto) {
    return this.attendanceRepository.createAttendance({
      ...dto,
      student: { id: dto.studentId } as any, // 👈 타입 오류 방지용 처리
    });
  }

  findAll() {
    return this.attendanceRepository.findAll();
  }

  findOne(id: number) {
    return this.attendanceRepository.findById(id);
  }

  update(id: number, dto: UpdateAttendanceDto) {
    const data: any = { ...dto };

    if (dto.studentId) {
      data.student = { id: dto.studentId } as any; // 👈 마찬가지로 처리
      delete data.studentId;
    }

    return this.attendanceRepository.updateAttendance(id, data);
  }

  remove(id: number) {
    return this.attendanceRepository.deleteAttendance(id);
  }

  findByStudentAndRange(studentId: number, startDate: string, endDate: string) {
    return this.attendanceRepository.findByStudentAndDateRange(studentId, startDate, endDate);
  }
}
