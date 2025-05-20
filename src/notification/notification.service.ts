import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(private readonly gateway: NotificationGateway) {}

  notify(userId: string, message: string) {
    this.gateway.sendToUser(userId, { message });
  }
}
