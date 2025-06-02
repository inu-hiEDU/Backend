import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { OfflineNotification } from './entities/offline-notification.entity';
import { NotificationController } from './notification.controller';
import { Student } from '../students/student.entity';
import { Parent } from '../parents/parent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OfflineNotification, Student, Parent])],
  controllers: [NotificationController],
  providers: [NotificationGateway, NotificationService],
  exports: [NotificationGateway, NotificationService],
})
export class NotificationModule {}
