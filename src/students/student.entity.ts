import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

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

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  user: User;
}
