import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from '../teachers/teacher.entity';
import { TeacherRepository } from '../teachers/teacher.repository';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, User])],
  controllers: [AdminController],
  providers: [AdminService, TeacherRepository],
})
export class AdminModule {}
