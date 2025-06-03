import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { TeacherRepository } from './teacher.repository';
import { Teacher } from './teacher.entity';
import { User } from '../user/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, User])],
  controllers: [TeacherController],
  providers: [TeacherService, TeacherRepository],
  exports: [TeacherRepository]
})
export class TeacherModule {}