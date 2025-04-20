import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AttendanceModule } from './attendance/attendance.module';
import { DatabaseConfigService } from './config/database.config';
import { CounselModule } from './counsel/counsel.module';
import { LoginModule } from './login/login.module';
import { ScoresModule } from './scores/score.module';
import { StudentModule } from './students/student.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    LoginModule,
    UploadModule,
    StudentModule,
    AttendanceModule,
    CounselModule,
    ScoresModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
