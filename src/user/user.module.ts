import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Teacher } from '../teachers/teacher.entity';
import { Parent } from '../parents/parent.entity';
import { UserService } from './user.service';
import { StudentModule } from '../students/student.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Teacher, Parent]),
    StudentModule, // StudentsModule 가져오기
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
