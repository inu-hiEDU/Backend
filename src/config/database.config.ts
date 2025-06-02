import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Attendance } from 'src/attendance/attendance.entity';
import { Counsel } from 'src/counsel/counsel.entity';
import { Feedback } from 'src/feedback/feedback.entity';
import { Login } from 'src/login/login.entity';
import { Parent } from 'src/parents/parent.entity';
import { Scores } from 'src/scores/score.entity';
import { Student } from 'src/students/student.entity';
import { Teacher } from 'src/teachers/teacher.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      replication: {
        master: {
          host: this.configService.get<string>('DB_HOST_PRIMARY'),
          port: 3306,
          username: this.configService.get<string>('DB_USERNAME'),
          password: this.configService.get<string>('DB_PASSWORD'),
          database: this.configService.get<string>('DB_DATABASE'),
        },
        slaves: [
          {
            host: this.configService.get<string>('DB_HOST_REPLICA1'),
            port: 3306,
            username: this.configService.get<string>('DB_USERNAME'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_DATABASE'),
          },
          {
            host: this.configService.get<string>('DB_HOST_REPLICA2'),
            port: 3306,
            username: this.configService.get<string>('DB_USERNAME'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_DATABASE'),
          },
        ],
      },
      synchronize: false, // 운영 환경에서는 false
      logging: true,
      entities: [
        Student,
        Login,
        Attendance,
        Counsel,
        Scores,
        User,
        Parent,
        Teacher,
        Feedback,
      ],
    };
  }
}
