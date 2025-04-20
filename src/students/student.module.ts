import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentController, StudentInfoController } from './student.controller';
import { Student } from './student.entity';
import { StudentRepository } from './student.repository';
import { StudentService } from './student.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student, StudentRepository])], // 하나로 묶기
  controllers: [StudentController, StudentInfoController],
  providers: [StudentService, StudentRepository],
})
export class StudentModule {}
