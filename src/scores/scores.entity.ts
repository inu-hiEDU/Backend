import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../students/student.entity';

@Entity()
export class Scores {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column()
  studentId: number;

  @Column()
  grade: number;

  @Column()
  semester: number;

  @Column({ nullable: true })
  subject1: number;

  @Column({ nullable: true })
  subject2: number;

  @Column({ nullable: true })
  subject3: number;

  @Column({ nullable: true })
  subject4: number;

  @Column({ nullable: true })
  subject5: number;

  @Column({ nullable: true })
  subject6: number;

  @Column({ nullable: true })
  subject7: number;

  @Column({ nullable: true })
  subject8: number;

  @Column({ nullable: true })
  totalScore: number;

  @Column('float', { nullable: true })
  averageScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
