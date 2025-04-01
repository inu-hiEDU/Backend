import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Login } from './login.entity';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(Login)
    private userRepository: Repository<Login>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<Login> {
    const { email, password, ...rest } = createUserDto;
  
    // 1. 중복 이메일 체크
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }
  
    // 2. 비밀번호 해시(bcrypt)
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // 3. 사용자 생성 및 저장
    const newLogin = this.userRepository.create({
      email,
      password: hashedPassword,
      ...rest,
    });
  
    return await this.userRepository.save(newLogin);
  }

  async validateUser(email: string, password: string): Promise<Login> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    return user;
  }

  async findById(id: number): Promise<Login> {
    const user = await this.userRepository.findOne({ where: { id } });
  
    if (!user) {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
    }
  
    return user;
  }  
}
