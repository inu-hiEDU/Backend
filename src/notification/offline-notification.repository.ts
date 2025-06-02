import { DataSource } from 'typeorm';
import { OfflineNotification } from './entities/offline-notification.entity';

export const OfflineNotificationRepository = (dataSource: DataSource) =>
  dataSource.getRepository(OfflineNotification);
