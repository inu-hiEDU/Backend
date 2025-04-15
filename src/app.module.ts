import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './config/database.config';
import { StudentModule } from './students/student.module';
import { LoginModule } from './login/login.module';
import { AttendanceModule } from './attendance/attendance.module';
import { CounselModule } from './counsel/counsel.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
