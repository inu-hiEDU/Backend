import { Repository, Between } from 'typeorm';
import { Counsel } from './counsel.entity';

export class CounselRepository extends Repository<Counsel> {
  // 상담 내역 생성
  async createCounsel(data: Partial<Counsel>) {
    const counsel = this.create(data);
    return this.save(counsel);
  }

  // 모든 상담 내역 조회
  async findAll() {
    return this.find({ relations: ['student'] });
  }

  // 특정 상담 내역 조회
  async findById(id: number) {
    return this.findOne({ where: { id }, relations: ['student'] });
  }

  // 상담 내역 업데이트
  async updateCounsel(id: number, data: Partial<Counsel>) {
    await this.update(id, data);
    return this.findById(id);
  }

  // 상담 내역 삭제
  async deleteCounsel(id: number) {
    return this.delete(id);
  }

  // 학생 ID와 날짜 범위로 상담 내역 조회
  async findByStudentAndDateRange(studentId: number, startDate: string, endDate: string) {
    // startDate와 endDate를 Date 객체로 변환하여 사용
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.find({
      where: {
        student: { id: studentId },
        counselDate: Between(start, end),  // 날짜 범위를 Date 객체로 처리
      },
      relations: ['student'],
    });
  }
}
