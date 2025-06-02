import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../students/student.entity';
import { Parent } from '../parents/parent.entity';

@Injectable()
export class NotificationService {
  constructor(
    private readonly gateway: NotificationGateway,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Parent)
    private readonly parentRepo: Repository<Parent>,
  ) {}

  // 성적 입력 알림
  async notifyScoreEntered(userId: string) {
    await this.gateway.sendToUser(userId, { message: '성적이 입력 되었습니다.' });
    const parentUserId = await this.getParentUserIdByStudentUserId(userId);
    if (parentUserId) {
      await this.gateway.sendToUser(parentUserId, { message: '성적이 입력 되었습니다.' });
    }
  }

  // 성적 수정 알림
  async notifyScoreUpdated(userId: string) {
    await this.gateway.sendToUser(userId, { message: '성적이 수정되었습니다.' });
    const parentUserId = await this.getParentUserIdByStudentUserId(userId);
    if (parentUserId) {
      await this.gateway.sendToUser(parentUserId, { message: '성적이 수정되었습니다.' });
    }
  }

  // 피드백 입력 알림
  async notifyFeedbackEntered(userId: string, subject: string) {
    const msg = `${subject} 세부 특기사항이 입력 되었습니다.`;
    await this.gateway.sendToUser(userId, { message: msg });
    const parentUserId = await this.getParentUserIdByStudentUserId(userId);
    if (parentUserId) {
      await this.gateway.sendToUser(parentUserId, { message: msg });
    }
  }

  // 피드백 수정 알림
  async notifyFeedbackUpdated(userId: string, subject: string) {
    const msg = `${subject} 세부 특기사항이 수정 되었습니다.`;
    await this.gateway.sendToUser(userId, { message: msg });
    const parentUserId = await this.getParentUserIdByStudentUserId(userId);
    if (parentUserId) {
      await this.gateway.sendToUser(parentUserId, { message: msg });
    }
  }

  // 상담 기록 업데이트 알림
  async notifyCounselingUpdated(userId: string) {
    const msg = '상담 기록이 업데이트 되었습니다.';
    await this.gateway.sendToUser(userId, { message: msg });
    const parentUserId = await this.getParentUserIdByStudentUserId(userId);
    if (parentUserId) {
      await this.gateway.sendToUser(parentUserId, { message: msg });
    }
  }

  // 학생 userId로 학부모 userId 찾기
  private async getParentUserIdByStudentUserId(studentUserId: string): Promise<string | null> {
    const student = await this.studentRepo.findOne({ where: { userId: Number(studentUserId) } });
    if (!student) return null;
    const parent = await this.parentRepo.findOne({ where: { studentId: student.id } });
    if (!parent) return null;
    return parent.userId ? parent.userId.toString() : null;
  }
}
