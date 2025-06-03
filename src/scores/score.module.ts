import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfflineNotification } from '../notification/entities/offline-notification.entity';
import { ScoreRepository } from './score.repository';
import { StudentRepository } from '../students/student.repository';
import { NotificationGateway } from '../notification/notification.gateway';
import { NotificationService } from '../notification/notification.service';
import { Parent } from '../parents/parent.entity';
import { ParentModule } from '../parents/parent.module';
import { Student } from '../students/student.entity';
import { ScoresController } from './score.controller';
import { Scores } from './score.entity';
import { ScoresService } from './score.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Scores, Student, OfflineNotification, Parent]),
    ParentModule,
  ],
  controllers: [ScoresController],
  providers: [
    ScoresService,
    ScoreRepository,
    StudentRepository,
    NotificationService,
    NotificationGateway,
  ],
})
export class ScoresModule {}
