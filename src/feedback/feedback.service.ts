import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from '../teachers/teacher.entity';
import { StudentRepository } from 'src/students/student.repository';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private readonly studentRepository: StudentRepository,
  ) {}

  async create(dto: CreateFeedbackDto, userId: number) {
    const teacher = await this.teacherRepository.findOne({ where: { userId } });
    const student = await this.studentRepository.findOneById(dto.studentId);
    if (!teacher) {
      throw new NotFoundException(
        '해당 사용자에 연결된 교사를 찾을 수 없습니다.',
      );
    }
    if (!student) {
      throw new NotFoundException('해당 학생을 찾을 수 없습니다.');
    }

    return this.feedbackRepository.createFeedback({
      ...dto,
      student: student,
      teacher: teacher, // 직접 Teacher 객체 넣기
      date: new Date(dto.date),
    });
  }

  findAll(studentId?: number, startDate?: string, endDate?: string) {
    return this.feedbackRepository.findByFilter(studentId, startDate, endDate);
  }

  async findOne(id: number, userId: number) {
    const teacher = await this.teacherRepository.findOneBy({ userId });
    if (!teacher) throw new ForbiddenException('교사 정보 없음');

    const feedback = await this.feedbackRepository.findByIdWithStudent(id); // student까지 join된 메서드 사용
    if (!feedback) throw new NotFoundException('피드백 없음');

    const student = feedback.student;

    // 학생의 현재 학년/반과 교사의 담임 정보 비교
    if (
      student.grade !== teacher.grade ||
      student.classroom !== teacher.homeroom
    ) {
      throw new ForbiddenException('해당 학생의 담임만 피드백을 볼 수 있습니다');
    }

    return feedback;
  }

  async update(id: number, dto: UpdateFeedbackDto, userId: number) {
    const teacher = await this.teacherRepository.findOneBy({ userId });
    if (!teacher) throw new ForbiddenException('교사 정보 없음');

    const feedback = await this.feedbackRepository.findByIdWithStudent(id);
    if (!feedback) throw new NotFoundException('피드백 없음');

    const student = feedback.student;
    if (
      student.grade !== teacher.grade ||
      student.classroom !== teacher.homeroom
    ) {
      throw new ForbiddenException(
        '해당 학생의 담임만 피드백을 수정할 수 있습니다',
      );
    }

    const data: any = { ...dto };
    if (dto.date) data.date = new Date(dto.date);
    if (dto.studentId) {
      data.student = { id: dto.studentId } as any;
      delete data.studentId;
    }

    return this.feedbackRepository.updateFeedback(id, data);
  }

  async remove(id: number, userId: number) {
    const teacher = await this.teacherRepository.findOneBy({ userId });
    if (!teacher) throw new ForbiddenException('교사 정보 없음');

    const feedback = await this.feedbackRepository.findByIdWithStudent(id);
    if (!feedback) throw new NotFoundException('피드백 없음');

    const student = feedback.student;
    if (
      student.grade !== teacher.grade ||
      student.classroom !== teacher.homeroom
    ) {
      throw new ForbiddenException(
        '해당 학생의 담임만 피드백을 삭제할 수 있습니다',
      );
    }

    return this.feedbackRepository.deleteFeedback(id);
  }

  async exportFeedbackReport(studentId: number, res: Response) {
    const feedbacks = await this.feedbackRepository.findByFilter(studentId);

    if (!feedbacks.length) {
      throw new NotFoundException('해당 학생의 피드백 기록이 없습니다.');
    }

    // 학생 이름 복호화 (첫 피드백의 학생 정보로)
    const student = feedbacks[0].student;
    const decryptedName = this.studentRepository.decrypt
      ? this.studentRepository.decrypt(student.name)
      : student.name; // 복호화 함수 확인 필요

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('피드백 기록');

    worksheet.mergeCells('A1:D1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `피드백 기록 보고서 - ${decryptedName}`;
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A2:D2');
    const dateCell = worksheet.getCell('A2');
    dateCell.value = `출력일: ${new Date().toLocaleDateString('ko-KR')}`;
    dateCell.font = { size: 10, italic: true, color: { argb: '777777' } };
    dateCell.alignment = { horizontal: 'left' };
    
    worksheet.addRow(['일자', '교사', '피드백 분야', '피드백 내용']);
    const headerRow = worksheet.getRow(3);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center' };

    function getSubjectName(subjectCode: string): string {
      switch (subjectCode) {
        case '01':
          return '국어';
        case '02':
          return '수학';
        case '03':
          return '영어';
        case '04':
          return '사회';
        case '05':
          return '과학';
        case '06':
          return '미술';
        case '07':
          return '음악';
        case '08':
          return '체육';
        default:
          return '기타';
      }
    }

    feedbacks.forEach((feedback) => {
      const dateValue = feedback.date
        ? (feedback.date instanceof Date
            ? feedback.date.toLocaleDateString('ko-KR')
            : new Date(feedback.date).toLocaleDateString('ko-KR'))
        : '';

      worksheet.addRow([
        dateValue,
        feedback.teacher?.name ?? '',
        getSubjectName(feedback.subject) ?? '',
        feedback.content ?? '',
      ]);
    });

    worksheet.columns.forEach((col) => {
      col.width = 20;
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    const filename = `피드백보고서_${decryptedName}.xlsx`;
    const encodedFilename = encodeURIComponent(filename);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodedFilename}`,
    );
    await workbook.xlsx.write(res);
    res.end();
  }
}
