import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(private readonly gateway: NotificationGateway) {}

  // 성적 입력 알림
  notifyScoreEntered(studentId: string) {
    this.gateway.sendToUser(studentId, { message: '성적이 입력 되었습니다.' });
    this.gateway.sendToUser(`${studentId}-parent`, { message: '성적이 입력 되었습니다.' });
  }

  // 성적 수정 알림
  notifyScoreUpdated(studentId: string) {
    this.gateway.sendToUser(studentId, { message: '성적이 수정되었습니다.' });
    this.gateway.sendToUser(`${studentId}-parent`, { message: '성적이 수정되었습니다.' });
  }

  // 피드백 입력 알림
  notifyFeedbackEntered(studentId: string, subject: string) {
    const msg = `${subject} 세부 특기사항이 입력 되었습니다.`;
    this.gateway.sendToUser(studentId, { message: msg });
    this.gateway.sendToUser(`${studentId}-parent`, { message: msg });
  }

  // 피드백 수정 알림
  notifyFeedbackUpdated(studentId: string, subject: string) {
    const msg = `${subject} 세부 특기사항이 수정 되었습니다.`;
    this.gateway.sendToUser(studentId, { message: msg });
    this.gateway.sendToUser(`${studentId}-parent`, { message: msg });
  }

  // 상담 기록 업데이트 알림
  notifyCounselingUpdated(studentId: string) {
    const msg = '상담 기록이 업데이트 되었습니다.';
    this.gateway.sendToUser(studentId, { message: msg });
    this.gateway.sendToUser(`${studentId}-parent`, { message: msg });
  }
}
