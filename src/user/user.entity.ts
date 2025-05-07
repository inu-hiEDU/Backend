import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserRole } from './user-role.enum';
import { Teacher } from '../teachers/teacher.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;
  
  @OneToMany(() => Teacher, (teacher) => teacher.user)
  teachers: Teacher[];
}
