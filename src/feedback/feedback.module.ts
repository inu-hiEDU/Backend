import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../students/student.entity';
import { FeedbackController } from './feedback.controller';
import { Feedback } from './feedback.entity';
import { FeedbackRepository } from './feedback.repository';
import { FeedbackService } from './feedback.service';
import { Teacher } from 'src/teachers/teacher.entity';
import { NotificationModule } from '../notification/notification.module';
import { StudentRepository } from 'src/students/student.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feedback, Student, Teacher]),
    NotificationModule,
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService, FeedbackRepository, StudentRepository],
})
export class FeedbackModule {}
