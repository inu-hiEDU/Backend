import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { StudentService } from '../students/student.service';

@ApiTags('업로드')
@Controller('api/upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly studentService: StudentService,
  ) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.uploadService.uploadFileToS3(file);
    return { imageUrl: result.url };
  }

  @Post('student-picture/:studentId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStudentPicture(
    @Param('studentId', ParseIntPipe) studentId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.uploadService.uploadFileToS3(file);
    // 학생 picture 컬럼 업데이트
    await this.studentService.updateStudent(studentId, { picture: result.url });
    return { imageUrl: result.url };
  }

  @Get('student-picture/:studentId')
  async getStudentPicture(@Param('studentId', ParseIntPipe) studentId: number) {
    const student = await this.studentService.getStudentById(studentId);
    return { imageUrl: student.picture };
  }
}
