import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { User } from '../user/user.entity';

// 암호화/복호화 설정
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.CRYPTO_KEY!, 'hex'); // 32 bytes
const iv = Buffer.from(process.env.CRYPTO_IV!, 'hex');   // 16 bytes

function encrypt(text: string) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encrypted: string) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

@Injectable()
export class StudentRepository {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  async findAll(): Promise<Student[]> {
    const students = await this.studentRepo.find();
    // 복호화
    return students.map((student) => ({
      ...student,
      name: student.name ? decrypt(student.name) : undefined,
      phoneNum: student.phoneNum ? decrypt(student.phoneNum) : undefined,
      birthday: student.birthday ? decrypt(student.birthday) : undefined,
    }));
  }

  async findOneById(id: number): Promise<Student> {
    const student = await this.studentRepo.findOneByOrFail({ id });
    // 복호화
    if (student) {
      student.name = student.name ? decrypt(student.name) : undefined;
      student.phoneNum = student.phoneNum ? decrypt(student.phoneNum) : undefined;
      student.birthday = student.birthday ? decrypt(student.birthday) : undefined;
    }
    return student;
  }

  async createStudent(dto: Partial<Student>): Promise<Student> {
    // 암호화
    const encryptedDto = {
      ...dto,
      name: dto.name ? encrypt(dto.name) : undefined,
      phoneNum: dto.phoneNum ? encrypt(dto.phoneNum) : undefined,
      birthday: dto.birthday ? encrypt(dto.birthday) : undefined,
    };
    const student = this.studentRepo.create(encryptedDto);
    const saved = await this.studentRepo.save(student);
    // 복호화 후 반환
    return {
      ...saved,
      name: saved.name ? decrypt(saved.name) : undefined,
      phoneNum: saved.phoneNum ? decrypt(saved.phoneNum) : undefined,
      birthday: saved.birthday ? decrypt(saved.birthday) : undefined,
    } as Student;
  }

  async updateStudent(id: number, dto: Partial<Student>): Promise<Student> {
    // 암호화
    const encryptedDto = {
      ...dto,
      name: dto.name ? encrypt(dto.name) : undefined,
      phoneNum: dto.phoneNum ? encrypt(dto.phoneNum) : undefined,
      birthday: dto.birthday ? encrypt(dto.birthday) : undefined,
    };
    await this.studentRepo.update(id, encryptedDto);
    return this.findOneById(id);
  }

  async deleteStudent(id: number): Promise<void> {
    await this.studentRepo.delete(id);
  }

  async findByGradeAndClassroom(
    grade: number,
    classroom: number,
  ): Promise<Student[]> {
    const students = await this.studentRepo
      .createQueryBuilder('student')
      .where('student.grade = :grade', { grade })
      .andWhere('student.classroom = :classroom', { classroom })
      .getMany();

    // 복호화
    return students.map((student) => ({
      ...student,
      name: student.name ? decrypt(student.name) : undefined,
      phoneNum: student.phoneNum ? decrypt(student.phoneNum) : undefined,
      birthday: student.birthday ? decrypt(student.birthday) : undefined,
    }));
  }

  async createStudentFromHakbeon(data: {
    hakbeon: string;
    name: string;
    phoneNum: string;
    birthday: string;
    userId: number; // User_id
  }): Promise<Student> {
    const { hakbeon, name, phoneNum, birthday, userId } = data;

    // 학번(hakbeon)에서 grade, classroom, studentNum 추출
    const grade = parseInt(hakbeon[0], 10);
    const classroom = parseInt(hakbeon.slice(1, 3), 10);
    const studentNum = parseInt(hakbeon.slice(3), 10);

    // User 엔티티
    const user = await this.studentRepo.manager.findOne(User, {
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }

    // 암호화
    const encryptedName = name ? encrypt(name) : undefined;
    const encryptedPhoneNum = phoneNum ? encrypt(phoneNum) : undefined;
    const encryptedBirthday = birthday ? encrypt(birthday) : undefined;

    // 새로운 학생 생성
    const student = this.studentRepo.create({
      grade,
      classroom,
      studentNum,
      name: encryptedName,
      phoneNum: encryptedPhoneNum,
      birthday: encryptedBirthday,
      user,
    });

    const saved = await this.studentRepo.save(student);

    // 복호화 후 반환
    return {
      ...saved,
      name: saved.name ? decrypt(saved.name) : undefined,
      phoneNum: saved.phoneNum ? decrypt(saved.phoneNum) : undefined,
      birthday: saved.birthday ? decrypt(saved.birthday) : undefined,
    } as Student;
  }
}
