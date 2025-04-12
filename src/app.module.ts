import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './config/database.config';
import { StudentModule } from './students/student.module';
import { LoginModule } from './login/login.module';
import { ScoresModule } from './scores/score.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    LoginModule,
    UploadModule,
    StudentModule,
    ScoresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
