import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../students/student.entity';
import { CreateScoreDto } from './dto/create-score.dto';
import { GetClassScoreDto } from './dto/get-class-score.dto';
import { GetScoreDto } from './dto/get-score.dto';
import { Scores } from './score.entity';
import { NotificationService } from '../notification/notification.service';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Scores)
    private scoresRepository: Repository<Scores>,

    @InjectRepository(Student)
    private studentRepository: Repository<Student>,

    private readonly notificationService: NotificationService,
  ) {}

  private calculateTotalAndAverage(score: Partial<Scores>) {
    const subjects = [
      score.subject1,
      score.subject2,
      score.subject3,
      score.subject4,
      score.subject5,
      score.subject6,
      score.subject7,
      score.subject8,
    ];

    const validScores = subjects.filter(
      (subject): subject is number => typeof subject === 'number'
    );
    const total = validScores.reduce((sum, subject) => sum + subject, 0);
    const average = validScores.length > 0 ? total / validScores.length : 0;

    return { total, average };
  }

  async createScore(dto: CreateScoreDto) {
    const { studentId, grade, semester, ...subjects } = dto;

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('해당 학생을 찾을 수 없습니다.');
    }

    let score = await this.scoresRepository.findOne({
      where: { student: { id: studentId }, grade, semester },
      relations: ['student'],
    });

    const now = new Date();
    const isNew = !score;

    if (!score) {
      score = this.scoresRepository.create({
        student,
        grade,
        semester,
        createdAt: now,
        updatedAt: now,
        ...subjects,
      });
    } else {
      Object.assign(score, subjects);
      score.updatedAt = now;
    }

    const { total, average } = this.calculateTotalAndAverage(score);
    score.totalScore = total;
    score.averageScore = average;

    const saved = await this.scoresRepository.save(score);

    // 알림 전송: 학생의 userId가 있으면 알림
    if(student.userId) {
      if (isNew) {
        this.notificationService.notifyScoreUpdated(
          student.userId.toString()
        );
      } else {
        this.notificationService.notifyScoreEntered(
          student.userId.toString()
        );
      }
    }

    return {
      message: isNew
        ? '성적 정보가 성공적으로 생성되었습니다.'
        : '성적 정보가 성공적으로 업데이트되었습니다.',
      updatedScore: {
        id: saved.id, // ← 성적 ID 포함
        studentId,
        grade,
        semester,
        subjects: {
          subject1: saved.subject1,
          subject2: saved.subject2,
          subject3: saved.subject3,
          subject4: saved.subject4,
          subject5: saved.subject5,
          subject6: saved.subject6,
          subject7: saved.subject7,
          subject8: saved.subject8,
        },
        total: saved.totalScore,
        average: saved.averageScore,
      },
    };
  }

  async getStudentScore(query: GetScoreDto) {
    const { studentId } = query;

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('해당 학생을 찾을 수 없습니다.');
    }

    const score = await this.scoresRepository.find({
      where: {
        student: { id: studentId },
      },
      relations: ['student'],
    });

    if (!score || score.length === 0) {
      throw new NotFoundException('해당 학생의 성적 정보를 찾을 수 없습니다.');
    }

    const response = score.map((score) => ({
      semester: score.semester,
      grade: score.grade,
      subjects: {
        subject1: score.subject1,
        subject2: score.subject2,
        subject3: score.subject3,
        subject4: score.subject4,
        subject5: score.subject5,
        subject6: score.subject6,
        subject7: score.subject7,
        subject8: score.subject8,
      },
      totalScore: score.totalScore,
      averageScore: score.averageScore,
    }));

    return {
      message: '학생의 성적 정보를 조회하였습니다.',
      studentId: student.id,
      studentNum: student.studentNum.toString(),
      studentName: student.name,
      grade: student.grade,
      scores: response,
    };
  }

  async getClassScore(query: GetClassScoreDto) {
    const { grade, semester, classroom } = query;

    const students = await this.studentRepository.find({
      where: { grade, classroom },
    });

    const result: {
      studentId: number;
      name: string;
      grade: number;
      class: number;
      semester: number;
      subjects: {
        subject1: number;
        subject2: number;
        subject3: number;
        subject4: number;
        subject5: number;
        subject6: number;
        subject7: number;
        subject8: number;
      };
      totalScore: number;
      averageScore: number;
    }[] = [];

    for (const student of students) {
      const score = await this.scoresRepository.findOne({
        where: {
          student: {
            id: student.id,
          },
          grade,
          semester,
        },
        relations: ['student'],
      });

      if (!score) continue;

      result.push({
        studentId: student.id,
        name: student.name,
        grade: student.grade,
        class: student.classroom,
        semester: score.semester,
        subjects: {
          subject1: score.subject1,
          subject2: score.subject2,
          subject3: score.subject3,
          subject4: score.subject4,
          subject5: score.subject5,
          subject6: score.subject6,
          subject7: score.subject7,
          subject8: score.subject8,
        },
        totalScore: score.totalScore,
        averageScore: score.averageScore,
      });
    }

    return {
      message:
        result.length > 0
          ? '학생의 성적 정보를 조회하였습니다.'
          : '해당 조건에 맞는 성적 정보가 없습니다.',
      students: result,
    };
  }

  async deleteScore(studentId: number, grade: number, semester: number) {
    const deletedScore = await this.scoresRepository.delete({
      student: { id: studentId },
      grade,
      semester,
    });

    if (deletedScore.affected === 0) {
      throw new NotFoundException('해당 성적 정보를 찾을 수 없습니다.');
    }

    return {
      message: '성적 정보가 성공적으로 삭제되었습니다.',
    };
  }

  async exportStudentScores(studentId: number, res: Response) {
    const scores = await this.scoresRepository.find({
      where: { student: { id: studentId } },
      relations: ['student'],
      order: { semester: 'ASC' },
    });

    if (!scores.length) {
      throw new NotFoundException('해당 학생의 성적 정보가 없습니다.');
    }

    const student = scores[0].student;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('성적 보고서');

    // ✅ 1. 제목
    worksheet.mergeCells('A1:L1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `학생 성적 보고서 - ${student.name}`;
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // ✅ 2. 날짜 라벨
    worksheet.mergeCells('A2:L2');
    const dateCell = worksheet.getCell('A2');
    dateCell.value = `출력일: ${new Date().toLocaleDateString('ko-KR')}`;
    dateCell.font = { size: 10, italic: true, color: { argb: '777777' } };
    dateCell.alignment = { horizontal: 'left' };

    // ✅ 3. 표 헤더 정의
    worksheet.addRow([
      '학년', '학기', '과목1', '과목2', '과목3', '과목4',
      '과목5', '과목6', '과목7', '과목8', '총점', '평균'
    ]);

    const headerRow = worksheet.getRow(3);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.alignment = { horizontal: 'center' };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '2F5597' }, // 진한 파랑
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // ✅ 4. 본문 데이터
    scores.forEach((s) => {
      worksheet.addRow([
        s.grade, s.semester,
        s.subject1 ?? '', s.subject2 ?? '', s.subject3 ?? '', s.subject4 ?? '',
        s.subject5 ?? '', s.subject6 ?? '', s.subject7 ?? '', s.subject8 ?? '',
        s.totalScore, s.averageScore,
      ]);
    });

    // ✅ 5. 전체 테두리 및 정렬 적용
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber >= 4) {
        row.alignment = { horizontal: 'center' };
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      }
    });

    // ✅ 6. 열 너비 자동 조절
    worksheet.columns.forEach((col) => {
      col.width = 10;
    });

    // ✅ 7. 다운로드 전송
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const filename = `성적보고서_${student.name}.xlsx`;
    const encodedFilename = encodeURIComponent(filename);

    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedFilename}`);
    await workbook.xlsx.write(res);
    res.end();
  }
}
