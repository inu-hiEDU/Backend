import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from '../students/student.entity';

@Entity()
export class Scores {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student)
  @JoinColumn()
  student: Student;

  @Column()
  grade: number;

  @Column()
  semester: number;

  @Column({ type: 'varchar', nullable: true })
  subject1: string;

  @Column({ type: 'varchar', nullable: true })
  subject2: string;

  @Column({ type: 'varchar', nullable: true })
  subject3: string;

  @Column({ type: 'varchar', nullable: true })
  subject4: string;

  @Column({ type: 'varchar', nullable: true })
  subject5: string;

  @Column({ type: 'varchar', nullable: true })
  subject6: string;

  @Column({ type: 'varchar', nullable: true })
  subject7: string;

  @Column({ type: 'varchar', nullable: true })
  subject8: string;

  @Column({ type: 'varchar', default: '0' })
  totalScore: string;

  @Column({ type: 'varchar', default: '0' })
  averageScore: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
