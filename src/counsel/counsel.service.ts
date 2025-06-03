import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CounselRepository } from './counsel.repository';
import { CreateCounselDto } from './dto/create-counsel.dto';
import { UpdateCounselDto } from './dto/update-counsel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from '../teachers/teacher.entity';
import { StudentRepository } from 'src/students/student.repository';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class CounselService {
  constructor(
    private readonly counselRepository: CounselRepository,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private readonly studentRepository: StudentRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async create(dto: CreateCounselDto, userId: number) {
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

    // 알림 전송
    void this.notificationService.notifyCounselingUpdated(
      dto.studentId.toString(),
    );

    return this.counselRepository.createCounsel({
      ...dto,
      student: student,
      teacher: teacher, // 직접 Teacher 객체 넣기
      date: new Date(dto.date),
    });
  }

  findAll(studentId?: number, startDate?: string, endDate?: string) {
    return this.counselRepository.findByFilter(studentId, startDate, endDate);
  }

  async findOne(id: number, userId: number) {
    const teacher = await this.teacherRepository.findOneBy({ userId });
    if (!teacher) throw new ForbiddenException('교사 정보 없음');

    const counsel = await this.counselRepository.findByIdWithStudent(id); // student까지 join된 메서드 사용
    if (!counsel) throw new NotFoundException('상담 없음');

    const student = counsel.student;

    // 학생의 현재 학년/반과 교사의 담임 정보 비교
    if (
      student.grade !== teacher.grade ||
      student.classroom !== teacher.homeroom
    ) {
      throw new ForbiddenException('해당 학생의 담임만 상담을 볼 수 있습니다');
    }

    return counsel;
  }

  async update(id: number, dto: UpdateCounselDto, userId: number) {
    const teacher = await this.teacherRepository.findOneBy({ userId });
    if (!teacher) throw new ForbiddenException('교사 정보 없음');

    const counsel = await this.counselRepository.findByIdWithStudent(id);
    if (!counsel) throw new NotFoundException('상담 없음');

    const student = counsel.student;
    if (
      student.grade !== teacher.grade ||
      student.classroom !== teacher.homeroom
    ) {
      throw new ForbiddenException(
        '해당 학생의 담임만 상담을 수정할 수 있습니다',
      );
    }

    const data: any = { ...dto };
    if (dto.date) data.date = new Date(dto.date);
    if (dto.studentId) {
      data.student = { id: dto.studentId } as any;
      delete data.studentId;
    }

    return this.counselRepository.updateCounsel(id, data);
  }

  async remove(id: number, userId: number) {
    const teacher = await this.teacherRepository.findOneBy({ userId });
    if (!teacher) throw new ForbiddenException('교사 정보 없음');

    const counsel = await this.counselRepository.findByIdWithStudent(id);
    if (!counsel) throw new NotFoundException('상담 없음');

    const student = counsel.student;
    if (
      student.grade !== teacher.grade ||
      student.classroom !== teacher.homeroom
    ) {
      throw new ForbiddenException(
        '해당 학생의 담임만 상담을 삭제할 수 있습니다',
      );
    }

    return this.counselRepository.deleteCounsel(id);
  }

  async exportCounselReport(studentId: number, res: Response) {
    const counsels = await this.counselRepository.findByFilter(studentId);

    if (!counsels.length) {
      throw new NotFoundException('해당 학생의 상담 기록이 없습니다.');
    }

    // 학생 이름 복호화 (첫 상담의 학생 정보로)
    const student = counsels[0].student;
    console.log(student)
    const decryptedName = this.studentRepository.decrypt
      ? this.studentRepository.decrypt(student.name)
      : student.name; // 복호화 함수 확인 필요
    console.log(decryptedName)
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('상담 기록');

    worksheet.mergeCells('A1:D1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `상담 기록 보고서 - ${decryptedName}`;
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A2:D2');
    const dateCell = worksheet.getCell('A2');
    dateCell.value = `출력일: ${new Date().toLocaleDateString('ko-KR')}`;
    dateCell.font = { size: 10, italic: true, color: { argb: '777777' } };
    dateCell.alignment = { horizontal: 'left' };
    
    worksheet.addRow(['일자', '교사', '상담 내용', '비고']);
    const headerRow = worksheet.getRow(3);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center' };

    counsels.forEach((counsel) => {
      const dateValue = counsel.date
        ? (counsel.date instanceof Date
            ? counsel.date.toLocaleDateString('ko-KR')
            : new Date(counsel.date).toLocaleDateString('ko-KR'))
        : '';

      worksheet.addRow([
        dateValue,
        counsel.teacher?.name ?? '',
        counsel.title ?? '',
        counsel.content ?? '',
      ]);
    });

    worksheet.columns.forEach((col) => {
      col.width = 20;
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    const filename = `상담보고서_${decryptedName}.xlsx`;
    const encodedFilename = encodeURIComponent(filename);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodedFilename}`,
    );
    await workbook.xlsx.write(res);
    res.end();
  }

}