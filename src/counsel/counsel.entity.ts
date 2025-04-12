import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Student } from '../students/student.entity';

@Entity()
export class Counsel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, {
      onDelete: 'CASCADE',
  })
  student: Student;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'text', nullable: true })
  note?: string;
}
