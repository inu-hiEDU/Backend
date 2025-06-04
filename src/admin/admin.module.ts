import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from '../teachers/teacher.entity';
import { Student } from '../students/student.entity';
import { TeacherRepository } from '../teachers/teacher.repository';
import { StudentModule } from '../students/student.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Teacher, Student]),
    StudentModule, // ✅ 올바르게 넣기
  ],
  controllers: [AdminController],
  providers: [AdminService, TeacherRepository, Student],
})
export class AdminModule {}
