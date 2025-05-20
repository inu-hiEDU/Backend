import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Attendance } from '../attendance/attendance.entity';
import { Counsel } from '../counsel/counsel.entity';
import { Login } from '../login/login.entity';
import { Parent } from '../parents/parent.entity';
import { Scores } from '../scores/score.entity';
import { Student } from '../students/student.entity';
import { Teacher } from '../teachers/teacher.entity';
import { User } from '../user/user.entity';

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      synchronize: true, // 개발 환경에서만 true로 설정
      logging: true, // 로그 확인용
      entities: [
        Student,
        Login,
        Attendance,
        Counsel,
        Scores,
        User,
        Parent,
        Teacher,
      ],
    };
  }
}
