import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../students/student.entity';
import { CounselController } from './counsel.controller';
import { Counsel } from './counsel.entity';
import { CounselRepository } from './counsel.repository';
import { CounselService } from './counsel.service';
import { Teacher } from 'src/teachers/teacher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Counsel, Student, Teacher])],
  controllers: [CounselController],
  providers: [CounselService, CounselRepository],
})
export class CounselModule {}
