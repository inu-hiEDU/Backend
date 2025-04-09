export class CreateCounselDto {
  studentId: number;  // 학생 ID (외래키)
  counselDate: Date;  // 상담일자 (YYYY-MM-DD)
  content: string;  // 상담 내용
}
