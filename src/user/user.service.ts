import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, ...rest } = createUserDto;

    // 이메일 중복 확인
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }

    // 사용자 생성
    const user = this.userRepository.create({
      email,
      ...rest,
    });

    return this.userRepository.save(user);
  }

  async findUserByEmail(email: string, name?: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { email } });

    // 사용자가 없으면 신규 유저 생성
    if (!user) {
      user = this.userRepository.create({
        email,
        name: name || 'default', // 구글 소셜 로그인에서 가져온 이름 사용, 없으면 기본값
        role: undefined, // role을 undefined로 설정하여 기본값 사용
      });
      user = await this.userRepository.save(user);
    }

    return user;
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  async updateUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
