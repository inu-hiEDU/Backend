import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
  } from 'typeorm';
  import { Student } from '../students/student.entity';
  
  export enum AttendanceStatus {
    PRESENT = '출석',
    ABSENT = '결석',
    LATE = '지각',
    EXCUSED = '공결',
  }
  
  @Entity()
  export class Attendance {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Student, {
      onDelete: 'CASCADE',
    })
    student: Student;
  
    @Column({ type: 'date' })
    date: string;
  
    @Column({ type: 'enum', enum: AttendanceStatus })
    status: AttendanceStatus;
  
    @Column({ type: 'text', nullable: true })
    note?: string;
  }
  