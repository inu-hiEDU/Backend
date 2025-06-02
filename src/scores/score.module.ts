import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../students/student.entity';
import { ScoresController } from './score.controller';
import { Scores } from './score.entity';
import { ScoresService } from './score.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationGateway } from '../notification/notification.gateway';
import { OfflineNotification } from '../notification/entities/offline-notification.entity';
import { Parent } from '../parents/parent.entity';
import { ParentModule } from '../parents/parent.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Scores, Student, OfflineNotification, Parent]),
    ParentModule,
  ],
  controllers: [ScoresController],
  providers: [ScoresService, NotificationService, NotificationGateway],
})
export class ScoresModule {}
