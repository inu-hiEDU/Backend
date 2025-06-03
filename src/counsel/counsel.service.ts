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
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CounselService {
  constructor(
    private readonly counselRepository: CounselRepository,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(dto: CreateCounselDto, userId: number) {
    const teacher = await this.teacherRepository.findOne({ where: { userId } });
    if (!teacher) {
      throw new NotFoundException(
        '해당 사용자에 연결된 교사를 찾을 수 없습니다.',
      );
    }

    this.notificationService.notifyCounselingUpdated(dto.studentId.toString());

    return this.counselRepository.createCounsel({
      ...dto,
      student: { id: dto.studentId } as any,
      teacher: { id: teacher.id } as any,
      date: new Date(dto.date),
    });
  }

  findAll(studentId?: number, startDate?: string, endDate?: string) {
    return this.counselRepository.findByFilter(studentId, startDate, endDate);
  }

  async findOne(id: number, userId: number) {
    const teacher = await this.teacherRepository.findOneBy({ userId });
    if (!teacher) throw new ForbiddenException('교사 정보 없음');

    const counsel = await this.counselRepository.findById(id);
    if (!counsel) throw new NotFoundException('상담 없음');

    if (counsel.subject !== teacher.subject) {
      throw new ForbiddenException('본인 담당 과목 상담이 아닙니다');
    }

    return counsel;
  }

  async update(id: number, dto: UpdateCounselDto, userId: number) {
    const teacher = await this.teacherRepository.findOneBy({ userId });
    if (!teacher) throw new ForbiddenException('교사 정보 없음');

    const counsel = await this.counselRepository.findById(id);
    if (!counsel) throw new NotFoundException('상담 없음');

    if (counsel.subject !== teacher.subject) {
      throw new ForbiddenException('수정 권한 없음');
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

    const counsel = await this.counselRepository.findById(id);
    if (!counsel) throw new NotFoundException('상담 없음');

    if (counsel.subject !== teacher.subject) {
      throw new ForbiddenException('삭제 권한 없음');
    }

    return this.counselRepository.deleteCounsel(id);
  }
}
