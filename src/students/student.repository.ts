import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { User } from '../user/user.entity';

const algorithm = 'aes-256-cbc';

@Injectable()
export class StudentRepository {
  private key: Buffer;
  private iv: Buffer;

  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    private readonly configService: ConfigService,
  ) {
    this.key = Buffer.from(
      this.configService.get<string>('CRYPTO_KEY')!,
      'hex',
    );
    this.iv = Buffer.from(this.configService.get<string>('CRYPTO_IV')!, 'hex');
  }

  private encrypt(text: string): string {
    const cipher = crypto.createCipheriv(algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  private decrypt(encrypted: string): string {
    const decipher = crypto.createDecipheriv(algorithm, this.key, this.iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async findAll(): Promise<Student[]> {
    const students = await this.studentRepo.find();
    return students.map((student) => ({
      ...student,
      name: student.name ? this.decrypt(student.name) : '',
      phoneNum: student.phoneNum ? this.decrypt(student.phoneNum) : '',
      birthday: student.birthday ? this.decrypt(student.birthday) : '',
    }));
  }

  async findOneById(id: number): Promise<Student> {
    const student = await this.studentRepo.findOneByOrFail({ id });
    student.name = student.name ? this.decrypt(student.name) : '';
    student.phoneNum = student.phoneNum ? this.decrypt(student.phoneNum) : '';
    student.birthday = student.birthday ? this.decrypt(student.birthday) : '';
    return student;
  }

  async createStudent(dto: Partial<Student>): Promise<Student> {
    const encryptedDto = {
      ...dto,
      name: dto.name ? this.encrypt(dto.name) : '',
      phoneNum: dto.phoneNum ? this.encrypt(dto.phoneNum) : '',
      birthday: dto.birthday ? this.encrypt(dto.birthday) : '',
    };
    const student = this.studentRepo.create(encryptedDto);
    const saved = await this.studentRepo.save(student);
    return {
      ...saved,
      name: saved.name ? this.decrypt(saved.name) : '',
      phoneNum: saved.phoneNum ? this.decrypt(saved.phoneNum) : '',
      birthday: saved.birthday ? this.decrypt(saved.birthday) : '',
    } as Student;
  }

  async updateStudent(id: number, dto: Partial<Student>): Promise<Student> {
    const encryptedDto = {
      ...dto,
      name: dto.name ? this.encrypt(dto.name) : '',
      phoneNum: dto.phoneNum ? this.encrypt(dto.phoneNum) : '',
      birthday: dto.birthday ? this.encrypt(dto.birthday) : '',
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

    return students.map((student) => ({
      ...student,
      name: student.name ? this.decrypt(student.name) : '',
      phoneNum: student.phoneNum ? this.decrypt(student.phoneNum) : '',
      birthday: student.birthday ? this.decrypt(student.birthday) : '',
    }));
  }

  async createStudentFromHakbeon(data: {
    hakbeon: string;
    name: string;
    phoneNum: string;
    birthday: string;
    userId: number;
  }): Promise<Student> {
    const { hakbeon, name, phoneNum, birthday, userId } = data;

    const grade = parseInt(hakbeon[0], 10);
    const classroom = parseInt(hakbeon.slice(1, 3), 10);
    const studentNum = parseInt(hakbeon.slice(3), 10);

    const user = await this.studentRepo.manager.findOne(User, {
      where: { id: userId },
    });
    if (!user) throw new Error('User not found');

    const student = this.studentRepo.create({
      grade,
      classroom,
      studentNum,
      name: name ? this.encrypt(name) : '',
      phoneNum: phoneNum ? this.encrypt(phoneNum) : '',
      birthday: birthday ? this.encrypt(birthday) : '',
      user,
    });

    const saved = await this.studentRepo.save(student);
    return {
      ...saved,
      name: saved.name ? this.decrypt(saved.name) : '',
      phoneNum: saved.phoneNum ? this.decrypt(saved.phoneNum) : '',
      birthday: saved.birthday ? this.decrypt(saved.birthday) : '',
    } as Student;
  }
}
