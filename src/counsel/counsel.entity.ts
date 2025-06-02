import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../students/student.entity';

@Entity()
export class Counsel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  student: Student;

  @Column()
  teacher: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  content: string;
}
