import { Injectable, NotFoundException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { NotificationService } from '../notification/notification.service';
import { StudentRepository } from '../students/student.repository';
import { CreateScoreDto } from './dto/create-score.dto';
import { GetClassScoreDto } from './dto/get-class-score.dto';
import { GetScoreDto } from './dto/get-score.dto';
import { Scores } from './score.entity';
import { ScoreRepository } from './score.repository';

@Injectable()
export class ScoresService {
  constructor(
    private readonly scoreRepository: ScoreRepository,
    private readonly studentRepository: StudentRepository,
    private readonly notificationService: NotificationService,
  ) {}

  private calculateTotalAndAverage(score: Partial<any>) {
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
      (subject): subject is number => typeof subject === 'number',
    );
    const total = validScores.reduce((sum, subject) => sum + subject, 0);
    const average = validScores.length > 0 ? total / validScores.length : 0;

    return { total, average };
  }

  private extractSubjectScores(scores: Scores[]) {
    return {
      subject1: scores.map((s) => ({
        studentId: s.student.id,
        score: Number(s.subject1) || 0,
      })),
      subject2: scores.map((s) => ({
        studentId: s.student.id,
        score: Number(s.subject2) || 0,
      })),
      subject3: scores.map((s) => ({
        studentId: s.student.id,
        score: Number(s.subject3) || 0,
      })),
      subject4: scores.map((s) => ({
        studentId: s.student.id,
        score: Number(s.subject4) || 0,
      })),
      subject5: scores.map((s) => ({
        studentId: s.student.id,
        score: Number(s.subject5) || 0,
      })),
      subject6: scores.map((s) => ({
        studentId: s.student.id,
        score: Number(s.subject6) || 0,
      })),
      subject7: scores.map((s) => ({
        studentId: s.student.id,
        score: Number(s.subject7) || 0,
      })),
      subject8: scores.map((s) => ({
        studentId: s.student.id,
        score: Number(s.subject8) || 0,
      })),
    };
  }

  private calculateAllSubjectGrades(
    subjectScores: ReturnType<typeof this.extractSubjectScores>,
  ) {
    return {
      subject1: this.assignGrades(subjectScores.subject1),
      subject2: this.assignGrades(subjectScores.subject2),
      subject3: this.assignGrades(subjectScores.subject3),
      subject4: this.assignGrades(subjectScores.subject4),
      subject5: this.assignGrades(subjectScores.subject5),
      subject6: this.assignGrades(subjectScores.subject6),
      subject7: this.assignGrades(subjectScores.subject7),
      subject8: this.assignGrades(subjectScores.subject8),
    };
  }

  private calculateAverageGrades(scores: Scores[]) {
    const averageScores = scores.map((s) => ({
      studentId: s.student.id,
      score: Number(s.averageScore),
    }));
    return this.assignGrades(averageScores);
  }

  private buildSubjectsWithGrades(
    score: Scores,
    subjectGrades: ReturnType<typeof this.calculateAllSubjectGrades>,
    subjectRanksAndAverages: ReturnType<typeof this.calculateRanksAndAverages>,
    studentId: number,
  ) {
    const subjects = [
      'subject1',
      'subject2',
      'subject3',
      'subject4',
      'subject5',
      'subject6',
      'subject7',
      'subject8',
    ] as const;

    const result: Record<
      string,
      {
        score: number | null | undefined;
        grade: string;
        rank: number;
        totalCount: number;
        average: number;
      }
    > = {};

    for (const subject of subjects) {
      const rawScore = score[subject];
      const scoreValue =
        rawScore !== null && rawScore !== undefined && rawScore !== ''
          ? Number(rawScore)
          : null;

      const grades = subjectGrades[subject];
      const ranksAndAverages = subjectRanksAndAverages[subject];

      result[subject] = {
        score: scoreValue,
        grade: grades[studentId] || 'E',
        rank: ranksAndAverages.rankMap[studentId] || 0,
        totalCount: ranksAndAverages.totalCount,
        average: ranksAndAverages.average,
      };
    }

    return result;
  }

  private calculateRanksAndAverages(
    subjectScores: ReturnType<typeof this.extractSubjectScores>,
  ) {
    // 과목별로 rank, count, average 계산
    const results: Record<
      string,
      {
        rankMap: { [studentId: number]: number };
        totalCount: number;
        average: number;
      }
    > = {};

    for (const subjectKey of Object.keys(subjectScores)) {
      const scores = subjectScores[subjectKey as keyof typeof subjectScores];
      const sorted = [...scores].sort((a, b) => b.score - a.score);
      const totalCount = sorted.length;
      const average =
        totalCount > 0
          ? sorted.reduce((sum, s) => sum + s.score, 0) / totalCount
          : 0;

      const rankMap: { [studentId: number]: number } = {};
      let currentRank = 1;
      let prevScore: number | null = null;
      let sameRankCount = 0;

      sorted.forEach((student, index) => {
        if (student.score !== prevScore) {
          currentRank = index + 1;
          sameRankCount = 1;
        } else {
          sameRankCount++;
        }
        rankMap[student.studentId] = currentRank;
        prevScore = student.score;
      });

      results[subjectKey] = { rankMap, totalCount, average };
    }

    return results;
  }

  private assignGrades(students: { studentId: number; score: number }[]): {
    [studentId: number]: string;
  } {
    const scoresWithIndex = students.map((student) => ({
      studentId: student.studentId,
      score: student.score,
    }));

    // 점수 기준으로 내림차순 정렬
    const sorted = [...scoresWithIndex].sort((a, b) => b.score - a.score);
    const total = sorted.length;
    const gradeCutoffs = [0.2, 0.4, 0.6, 0.8].map((p) => Math.ceil(p * total));

    const studentGrades: { [studentId: number]: string } = {};
    sorted.forEach((student, index) => {
      let grade: string;
      if (index < gradeCutoffs[0]) grade = 'A';
      else if (index < gradeCutoffs[1]) grade = 'B';
      else if (index < gradeCutoffs[2]) grade = 'C';
      else if (index < gradeCutoffs[3]) grade = 'D';
      else grade = 'E';
      studentGrades[student.studentId] = grade;
    });

    return studentGrades;
  }

  async createScore(dto: CreateScoreDto) {
    const { studentId, grade, semester, ...subjects } = dto;

    const student = await this.scoreRepository.findStudentOrFail(studentId);
    if (!student) {
      throw new NotFoundException('해당 학생을 찾을 수 없습니다.');
    }

    let score = await this.scoreRepository.findOneByStudentGradeSemester(
      studentId,
      grade,
      semester,
    );

    const now = new Date();
    const isNew = !score;

    if (!score) {
      score = await this.scoreRepository.saveScore({
        student,
        grade,
        semester,
        createdAt: now,
        updatedAt: now,
        ...Object.fromEntries(
          Object.entries(subjects).map(([k, v]) => [
            k,
            v !== undefined ? v.toString() : undefined,
          ]),
        ),
      });
    } else {
      Object.assign(
        score,
        Object.fromEntries(
          Object.entries(subjects).map(([k, v]) => [
            k,
            v !== undefined ? v.toString() : undefined,
          ]),
        ),
      );
      score.updatedAt = now;
    }

    const { total, average } = this.calculateTotalAndAverage(subjects);
    if (!score) {
      throw new NotFoundException('성적 정보를 저장할 수 없습니다.');
    }
    score.totalScore = this.scoreRepository.encrypt(total.toString());
    score.averageScore = this.scoreRepository.encrypt(average.toString());

    const saved = await this.scoreRepository.saveScore(score);

    // 같은 반 학생들의 성적을 가져와서 등급 계산
    const classmates =
      await this.scoreRepository.findScoresByGradeSemesterClassroom(
        grade,
        semester,
        student.classroom,
      );

    // 각 과목별 점수 추출
    const subjectScores = this.extractSubjectScores(classmates);

    // 각 과목별 등급 계산
    const subjectGrades = this.calculateAllSubjectGrades(subjectScores);

    // 각 과목별 석차 및 평균 계산 추가
    const subjectRanksAndAverages =
      this.calculateRanksAndAverages(subjectScores);

    // 평균 점수로 전체 등급 계산
    const averageGrades = this.calculateAverageGrades(classmates);
    const scoreGrade = averageGrades[studentId] || 'E';

    // 알림 전송: 학생의 userId가 있으면 알림
    if (student.userId) {
      if (isNew) {
        void this.notificationService.notifyScoreEntered(
          student.userId.toString(),
        );
      } else {
        void this.notificationService.notifyScoreUpdated(
          student.userId.toString(),
        );
      }
    }

    return {
      message: isNew
        ? '성적 정보가 성공적으로 생성되었습니다.'
        : '성적 정보가 성공적으로 업데이트되었습니다.',
      updatedScore: {
        id: saved.id,
        studentId,
        grade,
        semester,
        subjects: this.buildSubjectsWithGrades(
          saved,
          subjectGrades,
          subjectRanksAndAverages,
          studentId,
        ),
        total: saved.totalScore,
        average: saved.averageScore,
        scoreGrade,
      },
    };
  }

  async getStudentScore(query: GetScoreDto) {
    const { studentId } = query;

    const student = await this.scoreRepository.findStudentOrFail(studentId);
    if (!student) {
      throw new NotFoundException('해당 학생을 찾을 수 없습니다.');
    }

    const scores = await this.scoreRepository.findByStudent(studentId);

    if (!scores || scores.length === 0) {
      throw new NotFoundException('해당 학생의 성적 정보를 찾을 수 없습니다.');
    }

    const response = await Promise.all(
      scores.map(async (score) => {
        const classmates =
          await this.scoreRepository.findScoresByGradeSemesterClassroom(
            score.grade,
            score.semester,
            student.classroom,
          );

        const subjectScores = this.extractSubjectScores(classmates);
        const subjectGrades = this.calculateAllSubjectGrades(subjectScores);
        const subjectRanksAndAverages =
          this.calculateRanksAndAverages(subjectScores);
        const averageGrades = this.calculateAverageGrades(classmates);

        const scoreGrade = averageGrades[studentId] || 'E';

        return {
          semester: score.semester,
          grade: score.grade,
          subjects: this.buildSubjectsWithGrades(
            score,
            subjectGrades,
            subjectRanksAndAverages, // ★ 여기에 추가
            studentId,
          ),
          totalScore: score.totalScore,
          averageScore: score.averageScore,
          scoreGrade,
        };
      }),
    );

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

    // 해당 반의 모든 학생 성적을 한 번에 가져옴
    const scores =
      await this.scoreRepository.findScoresByGradeSemesterClassroom(
        grade,
        semester,
        classroom,
      );

    if (!scores || scores.length === 0) {
      return {
        message: '해당 조건에 맞는 성적 정보가 없습니다.',
        students: [],
      };
    }

    // 각 과목별 점수 추출
    const subjectScores = this.extractSubjectScores(scores);

    // 각 과목별 등급 계산
    const subjectGrades = this.calculateAllSubjectGrades(subjectScores);

    // 각 과목별 석차 및 평균 계산 추가
    const subjectRanksAndAverages =
      this.calculateRanksAndAverages(subjectScores);

    // 평균 점수로 전체 등급 계산
    const averageGrades = this.calculateAverageGrades(scores);

    // 결과 매핑
    const studentsWithGrades = scores.map((score) => {
      const student = score.student;
      return {
        studentId: student.id,
        name: student.name,
        grade: student.grade,
        class: student.classroom,
        semester: score.semester,
        subjects: this.buildSubjectsWithGrades(
          score,
          subjectGrades,
          subjectRanksAndAverages,
          student.id,
        ),
        totalScore: score.totalScore,
        averageScore: score.averageScore,
        scoreGrade: averageGrades[student.id] || 'E',
      };
    });

    return {
      message: '학생의 성적 정보를 조회하였습니다.',
      students: studentsWithGrades,
    };
  }

  async deleteScore(studentId: number, grade: number, semester: number) {
    const deletedScore = await this.scoreRepository.deleteScore(
      studentId,
      grade,
      semester,
    );

    if (deletedScore.affected === 0) {
      throw new NotFoundException('해당 성적 정보를 찾을 수 없습니다.');
    }

    return {
      message: '성적 정보가 성공적으로 삭제되었습니다.',
    };
  }

  async exportStudentScores(studentId: number, res: Response) {
    const scores = await this.scoreRepository.findByStudent(studentId);

    if (!scores.length) {
      throw new NotFoundException('해당 학생의 성적 정보가 없습니다.');
    }

    const student = scores[0].student;
    const decryptedName = this.scoreRepository.decrypt(student.name);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('성적 보고서');

    worksheet.mergeCells('A1:L1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `학생 성적 보고서 - ${decryptedName}`;
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A2:L2');
    const dateCell = worksheet.getCell('A2');
    dateCell.value = `출력일: ${new Date().toLocaleDateString('ko-KR')}`;
    dateCell.font = { size: 10, italic: true, color: { argb: '777777' } };
    dateCell.alignment = { horizontal: 'left' };

    worksheet.addRow([
      '학년',
      '학기',
      '국어',
      '수학',
      '영어',
      '사회',
      '과학',
      '미술',
      '음악',
      '체육',
      '총점',
      '평균',
    ]);

    const headerRow = worksheet.getRow(3);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.alignment = { horizontal: 'center' };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '2F5597' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    scores.forEach((s) => {
      worksheet.addRow([
        s.grade,
        s.semester,
        s.subject1 ?? '',
        s.subject2 ?? '',
        s.subject3 ?? '',
        s.subject4 ?? '',
        s.subject5 ?? '',
        s.subject6 ?? '',
        s.subject7 ?? '',
        s.subject8 ?? '',
        s.totalScore,
        s.averageScore,
      ]);
    });

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

    worksheet.columns.forEach((col) => {
      col.width = 10;
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    const filename = `성적보고서_${decryptedName}.xlsx`;
    const encodedFilename = encodeURIComponent(filename);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodedFilename}`,
    );
    await workbook.xlsx.write(res);
    res.end();
  }

  async createBulkScore(studentId: number, scores: CreateScoreDto[]) {
    const results = await Promise.all(
      scores.map((score) => {
        const { studentId: _omit, ...rest } = score;
        return this.createScore({ studentId, ...rest });
      }),
    );
    return {
      message: '모든 성적이 성공적으로 등록되었습니다.',
      results,
    };
  }
}
