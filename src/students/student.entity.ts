import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentNum: number;

  @Column()
  name: string;

  @Column()
  grade: number;

  @Column({ name: 'class' })
  classroom: number;

  @Column()
  phoneNum: string;

  @Column()
  birthday: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true, nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  picture: string;
}
