import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum LoginRole {
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
}

@Entity({ name: 'Login' })
export class Login {
  @PrimaryGeneratedColumn({ name: 'Key' })
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '사용자 이름',
  })
  name: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: true,
    comment: '이메일',
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '비밀번호',
  })
  password: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: LoginRole,
    nullable: true,
    comment: '사용자 역할',
  })
  role: LoginRole;

  @CreateDateColumn({ name: 'created_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '수정일' })
  updatedAt: Date;
}
