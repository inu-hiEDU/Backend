import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { AttendanceRepository } from './attendance.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance])],
  controllers: [AttendanceController],
  providers: [AttendanceService, AttendanceRepository],
})
export class AttendanceModule {}
