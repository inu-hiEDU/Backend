import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../students/student.entity';
import { CounselController } from './counsel.controller';
import { Counsel } from './counsel.entity';
import { CounselRepository } from './counsel.repository';
import { CounselService } from './counsel.service';
import { Teacher } from 'src/teachers/teacher.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Counsel, Student, Teacher]),
    NotificationModule,
  ],
  controllers: [CounselController],
  providers: [CounselService, CounselRepository],
})
export class CounselModule {}
