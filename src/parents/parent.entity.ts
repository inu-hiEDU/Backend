import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Student } from '../students/student.entity';

@Entity()
export class Parent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phoneNum: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Student, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ nullable: true })
  studentId: number;
}
