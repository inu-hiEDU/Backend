import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../students/student.entity';

export enum AttendanceStatus {
  PRESENT = '출석',
  ABSENT = '결석',
  LATE = '지각',
  ETC = '기타',
}

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  student: Student;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: AttendanceStatus })
  status: AttendanceStatus;

  @Column({ type: 'text', nullable: true })
  note?: string;
}
