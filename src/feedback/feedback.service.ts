import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from '../teachers/teacher.entity';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';
import { Student } from '../students/student.entity';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(dto: CreateFeedbackDto, userId: number) {
    const teacher = await this.teacherRepository.findOne({ where: { userId } });
    if (!teacher) {
      throw new NotFoundException(
        '해당 사용자에 연결된 교사를 찾을 수 없습니다.',
      );
    }

    void this.notificationService.notifyFeedbackEntered(
      dto.studentId.toString(),
      dto.subject.toString(),
    );

    return this.feedbackRepository.createFeedback({
      student: { id: dto.studentId } as Student,
      teacher: teacher.id.toString(),
      date: new Date(dto.date),
      subject: +dto.subject,
      content: dto.content,
      release: !!dto.release,
    });
  }

  findAll(studentId?: number, startDate?: string, endDate?: string) {
    return this.feedbackRepository.findByFilter(studentId, startDate, endDate);
  }

  findOne(id: number) {
    return this.feedbackRepository.findById(id);
  }

  update(id: number, dto: UpdateFeedbackDto) {
    if (dto.studentId !== undefined) {
      void this.notificationService.notifyFeedbackUpdated(
        dto.studentId.toString(),
        dto.subject?.toString() ?? '',
      );
    }
    const data: Partial<import('./feedback.entity').Feedback> = {};
    if (dto.date) {
      data.date = new Date(dto.date);
    }
    if (dto.subject !== undefined) {
      data.subject = +dto.subject;
    }
    if (dto.studentId !== undefined) {
      data.student = { id: dto.studentId } as Student;
    }
    if (dto.content !== undefined) {
      data.content = dto.content;
    }
    if (dto.release !== undefined) {
      data.release = !!dto.release;
    }
    return this.feedbackRepository.updateFeedback(id, data);
  }

  remove(id: number) {
    return this.feedbackRepository.deleteFeedback(id);
  }
}
