import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { StudentService } from './student.service';
import { StudentController, StudentInfoController } from './student.controller';
import { StudentRepository } from './student.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Student, StudentRepository])], // 하나로 묶기
  controllers: [StudentController, StudentInfoController],
  providers: [StudentService, StudentRepository],
})
export class StudentModule {}
