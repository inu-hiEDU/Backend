import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentController } from './student.controller';
import { Student } from './student.entity';
import { StudentRepository } from './student.repository';
import { StudentService } from './student.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student, StudentRepository])],
  controllers: [StudentController],
  providers: [StudentService, StudentRepository],
  exports: [TypeOrmModule, StudentService],
})
export class StudentModule {}
