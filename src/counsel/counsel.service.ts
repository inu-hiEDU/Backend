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
import { Student } from 'src/students/student.entity';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CounselService {
  constructor(
    private readonly counselRepository: CounselRepository,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(dto: CreateCounselDto, userId: number) {
    const teacher = await this.teacherRepository.findOne({ where: { userId } });
    const student = await this.studentRepository.findOne({ where: { id: dto.studentId } });
    if (!teacher) {
      throw new NotFoundException('해당 사용자에 연결된 교사를 찾을 수 없습니다.');
    }
    if (!student) {
      throw new NotFoundException('해당 학생을 찾을 수 없습니다.');
    }

    // 알림 전송
    void this.notificationService.notifyCounselingUpdated(dto.studentId.toString());

    return this.counselRepository.createCounsel({
      ...dto,
      student: student,
      teacher: teacher,  // 직접 Teacher 객체 넣기
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
}
