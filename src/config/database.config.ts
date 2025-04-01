import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Student } from 'src/students/student.entity';
import { Login } from 'src/login/login.entity';


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
      entities: [Student, Login],
    };
  }
}
