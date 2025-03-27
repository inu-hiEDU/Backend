import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @Column()
  name: string;

  @Column()
  phoneNum: string;

  @Column()
  avgScore: number;

  @Column()
  birthday: string;

  @Column()
  avgGrade: string;
}
