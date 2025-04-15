import { Injectable } from '@nestjs/common';
import { CounselRepository } from './counsel.repository';
import { CreateCounselDto } from './dto/create-counsel.dto';
import { UpdateCounselDto } from './dto/update-counsel.dto';

@Injectable()
export class CounselService {
  constructor(private readonly counselRepository: CounselRepository) {}

  create(dto: CreateCounselDto) {
    return this.counselRepository.createCounsel({
      ...dto,
      student: { id: dto.studentId } as any,
      date: new Date(dto.date),
    });
  }

  findAll(studentId?: number, startDate?: string, endDate?: string) {
    return this.counselRepository.findByFilter(studentId, startDate, endDate);
  }

  findOne(id: number) {
    return this.counselRepository.findById(id);
  }

  update(id: number, dto: UpdateCounselDto) {
    const data: any = { ...dto };
    if (dto.date) {
      data.date = new Date(dto.date);
    }
    if (dto.studentId) {
      data.student = { id: dto.studentId } as any;
      delete data.studentId;
    }
    return this.counselRepository.updateCounsel(id, data);
  }

  remove(id: number) {
    return this.counselRepository.deleteCounsel(id);
  }
}