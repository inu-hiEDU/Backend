import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../students/student.entity';
import { AttendanceController } from './attendance.controller';
import { Attendance } from './attendance.entity';
import { AttendanceRepository } from './attendance.repository';
import { AttendanceService } from './attendance.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Student])],
  controllers: [AttendanceController],
  providers: [AttendanceService, AttendanceRepository],
})
export class AttendanceModule {}
