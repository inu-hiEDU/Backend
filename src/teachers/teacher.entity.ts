import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Teacher {
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
}