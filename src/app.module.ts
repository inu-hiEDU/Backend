import { Module } from '@nestjs/common';
import { DatabaseModule } from './typeorm/typeorm.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [DatabaseModule, UploadModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
