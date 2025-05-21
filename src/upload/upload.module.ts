import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { StudentModule } from '../students/student.module';

@Module({
  imports: [StudentModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
