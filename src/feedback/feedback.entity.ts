import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../students/student.entity';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  student: Student;

  @Column()
  teacher: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  subject: Number;

  @Column({ type: 'text' })
  content: string;

  @Column()
  release: boolean;
}
