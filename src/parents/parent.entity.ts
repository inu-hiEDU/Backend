import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Student } from '../students/student.entity';

@Entity()
export class Parent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phoneNum: string;

  @Column()
  birthday: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  user: User; // User 테이블의 외래 키

  @ManyToOne(() => Student, { onDelete: 'CASCADE', eager: true })
  student: Student; // Student 테이블의 외래 키
}