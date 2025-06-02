import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from '../teachers/teacher.entity';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';

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
      throw new NotFoundException('해당 사용자에 연결된 교사를 찾을 수 없습니다.');
    }

    this.notificationService.notifyFeedbackEntered(
      dto.studentId.toString(),
    )

    return this.feedbackRepository.createFeedback({
      ...dto,
      student: { id: dto.studentId } as any,
      teacher: { id: teacher.id } as any,
      date: new Date(dto.date),
    });
  }

  findAll(studentId?: number, startDate?: string, endDate?: string) {
    return this.feedbackRepository.findByFilter(studentId, startDate, endDate);
  }

  findOne(id: number) {
    return this.feedbackRepository.findById(id);
  }

  update(id: number, dto: UpdateFeedbackDto) {
    const data: any = { ...dto };
    if (dto.date) {
      data.date = new Date(dto.date);
    }
    if (dto.studentId) {
      data.student = { id: dto.studentId } as any;
      delete data.studentId;
    }
    return this.feedbackRepository.updateFeedback(id, data);
  }

  remove(id: number) {
    return this.feedbackRepository.deleteFeedback(id);
  }
}
