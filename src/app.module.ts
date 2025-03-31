import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
// import { UsersModule } from './users/users.module';
import { typeOrmConfig } from './\bconfig/typeOrm.config';

@Module({
  imports: [
    ConfigModule.forRoot(), // .env 파일 로드
    TypeOrmModule.forRoot(typeOrmConfig),
    // UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
