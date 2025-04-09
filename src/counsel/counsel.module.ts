import { Module } from '@nestjs/common';
import { CounselService } from './counsel.service';
import { CounselController } from './counsel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CounselRepository } from './counsel.repository';
import { Counsel } from './counsel.entity';
import { Student } from '../students/student.entity';  // Student 엔티티 가져오기

@Module({
  imports: [TypeOrmModule.forFeature([Counsel])],
  providers: [
    CounselService,
    {
      provide: CounselRepository,
      useClass: CounselRepository,
    },
  ],
  controllers: [CounselController],
  exports: [CounselRepository],
})
export class CounselModule {}
