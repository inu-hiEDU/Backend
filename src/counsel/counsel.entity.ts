import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from '../students/student.entity';
import { Teacher } from '../teachers/teacher.entity';

@Entity()
export class Counsel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column()
  studentId: number;

  @ManyToOne(() => Teacher, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacherId' })
  teacher: string;

  @Column()
  teacherId: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;
}
