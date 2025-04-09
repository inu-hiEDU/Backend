import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CounselRepository } from './counsel.repository';
import { Counsel } from './counsel.entity';
import { CreateCounselDto } from './dto/create-counsel.dto';
import { UpdateCounselDto } from './dto/update-counsel.dto';

@Injectable()
export class CounselService {
  constructor(
    @InjectRepository(CounselRepository)
    private readonly counselRepository: CounselRepository,
  ) {}

  // 상담 내역 생성
  async create(createCounselDto: CreateCounselDto): Promise<Counsel> {
    return this.counselRepository.createCounsel(createCounselDto);  // POST 처리
  }

  // 모든 상담 내역 조회
  async findAll(): Promise<Counsel[]> {
    return this.counselRepository.findAll();
  }

  // 특정 상담 내역 조회
  async findById(id: number): Promise<Counsel> {
    const counsel = await this.counselRepository.findById(id);
    if (!counsel) {
      throw new Error('Counsel not found');  // 상담 내역이 없으면 예외를 던짐
    }
    return counsel;
  }

  // 상담 내역 업데이트
async update(id: number, updateCounselDto: UpdateCounselDto): Promise<Counsel> {
  // 1. findById로 상담 내역을 조회하고, 존재하지 않으면 예외를 던집니다.
  const counsel = await this.findById(id);
  if (!counsel) {
    throw new Error('Counsel not found');
  }

  // 2. 수정할 데이터로 상담 내역을 업데이트합니다.
  await this.counselRepository.updateCounsel(id, updateCounselDto);

  // 3. 업데이트된 상담 내역을 반환하려면, 다시 `findById`를 호출하여 수정된 상담 내역을 반환합니다.
  return this.findById(id);  // 업데이트된 상담 내역을 반환
}

  // 상담 내역 삭제
  async remove(id: number): Promise<void> {
    const result = await this.counselRepository.deleteCounsel(id);
    if (result.affected === 0) {
      throw new Error('Counsel not found or already deleted');
    }
  }

  // 학생 ID와 날짜 범위로 상담 내역 조회
  async findByStudentAndDateRange(studentId: number, startDate: string, endDate: string): Promise<Counsel[]> {
    return this.counselRepository.findByStudentAndDateRange(studentId, startDate, endDate);  // GET 처리
  }
}
