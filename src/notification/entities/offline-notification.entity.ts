import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn
} from 'typeorm';

@Entity()
export class OfflineNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column('json')
  payload: any;

  @CreateDateColumn()
  createdAt: Date;
}
