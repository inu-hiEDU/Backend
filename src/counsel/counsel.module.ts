import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Counsel } from './counsel.entity';
import { CounselService } from './counsel.service';
import { CounselController } from './counsel.controller';
import { CounselRepository } from './counsel.repository';
import { Student } from '../students/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Counsel, Student])],
  controllers: [CounselController],
  providers: [CounselService, CounselRepository],
})
export class CounselModule {}