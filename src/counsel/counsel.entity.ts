import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Student } from '../students/student.entity';  // Student 엔티티를 가져오기

@Entity()
export class Counsel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student)
  student: Student;  // 단방향 관계로 Student 참조

  @Column({ name: 'counselDate', type: 'date' })
  counselDate: Date;  // 상담일자 (YYYY-MM-DD)

  @Column('text')
  content: string;  // 상담 내용
}
