import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentNum: number;

  @Column()
  name: string;

  @Column()
  grade: number;

  @Column({ name: 'class' }) // DB 필드는 class, 코드에서는 classroom
  classroom: number;

  @Column()
  phoneNum: string;

  @Column()
  birthday: string;
}
