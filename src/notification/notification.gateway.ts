import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfflineNotification } from './entities/offline-notification.entity';

// WebSocketGateway 설정
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway implements OnGatewayConnection {
  private clients = new Map<string, Socket>();

  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(OfflineNotification)
    private readonly offlineRepo: Repository<OfflineNotification>,
  ) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;

    // 유저 ID가 없으면 연결 거부
    const existing = this.clients.get(userId);
    if (existing && existing.id !== client.id) {
      existing.disconnect(); // 이전 소켓 끊기
    }

    // 새 소켓 연결
    this.clients.set(userId, client);
    console.log('프론트에서 소켓 연결 userId:', userId);

    // db에 저장된 알림 꺼내서 전송 (삭제 안함)
    const saved = await this.offlineRepo.find({ where: { userId } });
    for (const notification of saved) {
      client.emit('notification', {
        id: notification.id,
        date: notification.createdAt,
        ...notification.payload,
      });
    }
  }

  async sendToUser(userId: string, payload: any) {
    console.log('알림 저장 및 전송 →', userId, payload.message);
    // 항상 DB에 저장
    const saved = await this.offlineRepo.save({ userId, payload });

    const client = this.clients.get(userId);
    if (client) {
      client.emit('notification', {
        id: saved.id, // DB에서 저장된 진짜 알림 ID
        message: payload.message,
        date: saved.createdAt,
      });
    } else {
      console.warn('알림 전송 실패: 연결된 소켓 없음 → DB 저장됨', userId);
    }
  }

  async deleteNotification(id: number) {
    console.warn('삭제 알림 : ', id);
    await this.offlineRepo.delete(id);
  }

  async deleteAllNotificationsByUserId(userId: string) {
    console.warn('전체 삭제 알림 : ', userId);
    await this.offlineRepo.delete({ userId });
  }

  async getNotificationsByUserId(userId: string) {
    return await this.offlineRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
