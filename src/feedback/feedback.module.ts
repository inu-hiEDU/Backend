import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../students/student.entity';
import { FeedbackController } from './feedback.controller';
import { Feedback } from './feedback.entity';
import { FeedbackRepository } from './feedback.repository';
import { FeedbackService } from './feedback.service';
import { Teacher } from 'src/teachers/teacher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback, Student, Teacher])],
  controllers: [FeedbackController],
  providers: [FeedbackService, FeedbackRepository],
})
export class FeedbackModule {}
