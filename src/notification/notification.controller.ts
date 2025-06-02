import { Controller, Delete, Get, Param } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly gateway: NotificationGateway) {}

  @Get(':userId')
  async findByUser(@Param('userId') userId: string) {
    const notifications = await this.gateway.getNotificationsByUserId(userId);
    return { data: notifications };
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.gateway.deleteNotification(id);
    return { message: '알림이 삭제되었습니다.' };
  }

  @Delete('user/:userId')
  async deleteAll(@Param('userId') userId: string) {
    await this.gateway.deleteAllNotificationsByUserId(userId);
    return { message: '모든 알림이 삭제되었습니다.' };
  }
}
