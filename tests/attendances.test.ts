import { Test, TestingModule } from '@nestjs/testing';
import {
  Attendance,
  AttendanceStatus,
} from '../src/attendance/attendance.entity';
import { AttendanceRepository } from '../src/attendance/attendance.repository';
import { AttendanceService } from '../src/attendance/attendance.service';
import { CreateAttendanceDto } from '../src/attendance/dto/create-attendance.dto';
import { UpdateAttendanceDto } from '../src/attendance/dto/update-attendance.dto';

describe('AttendanceService', () => {
  let service: AttendanceService;
  let repository: AttendanceRepository;

  const mockAttendanceRepository = {
    createAttendance: jest.fn(),
    findByFilter: jest.fn(),
    findById: jest.fn(),
    updateAttendance: jest.fn(),
    deleteAttendance: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: AttendanceRepository,
          useValue: mockAttendanceRepository,
        },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
    repository = module.get<AttendanceRepository>(AttendanceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAttendance', () => {
    it('should create and return an attendance record', async () => {
      const createDto: CreateAttendanceDto = {
        studentId: 1,
        date: '2023-04-25',
        status: AttendanceStatus.PRESENT,
        note: 'On time',
      };

      const result: Attendance = {
        id: 1,
        student: { id: 1 } as any,
        date: new Date(createDto.date),
        status: createDto.status,
        note: createDto.note,
      };

      mockAttendanceRepository.createAttendance.mockResolvedValue(result);

      expect(await service.create(createDto)).toBe(result);
      expect(mockAttendanceRepository.createAttendance).toHaveBeenCalledWith({
        student: { id: 1 } as any,
        date: new Date(createDto.date),
        status: createDto.status,
        note: createDto.note,
      });
    });
  });

  describe('findAllAttendance', () => {
    it('should return an array of attendance records', async () => {
      const result: Attendance[] = [
        {
          id: 1,
          student: { id: 1 } as any, // Ensure student is properly mocked
          date: new Date('2023-04-25'),
          status: AttendanceStatus.PRESENT,
          note: 'On time',
        },
      ];

      // Mock `findByFilter` to return `result` when no filters are passed
      mockAttendanceRepository.findByFilter.mockResolvedValue(result);

      // Simulating calling `findAll` with no parameters
      const attendanceRecords = await service.findAll();

      // Debugging the output
      console.log(attendanceRecords);

      // Deep equality check
      expect(attendanceRecords).toEqual(result);
      expect(mockAttendanceRepository.findByFilter).toHaveBeenCalled();
    });

    it('should return filtered attendance records when studentId is provided', async () => {
      const result: Attendance[] = [
        {
          id: 1,
          student: { id: 1 } as any,
          date: new Date('2023-04-25'),
          status: AttendanceStatus.PRESENT,
          note: 'On time',
        },
      ];

      const studentId = 1;
      mockAttendanceRepository.findByFilter.mockResolvedValue(result);

      // Call findAll with a studentId
      const attendanceRecords = await service.findAll(studentId);

      console.log(attendanceRecords);

      expect(attendanceRecords).toEqual(result);
      expect(mockAttendanceRepository.findByFilter).toHaveBeenCalledWith(
        studentId,
        undefined,
        undefined,
      );
    });
  });

  describe('findOneAttendance', () => {
    it('should return a single attendance record by id', async () => {
      const result: Attendance = {
        id: 1,
        student: { id: 1 } as any,
        date: new Date('2023-04-25'),
        status: AttendanceStatus.PRESENT,
        note: 'On time',
      };

      mockAttendanceRepository.findById.mockResolvedValue(result);

      expect(await service.findOne(1)).toBe(result);
      expect(mockAttendanceRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateAttendance', () => {
    it('should update and return the attendance record', async () => {
      const updateDto: UpdateAttendanceDto = {
        status: AttendanceStatus.LATE,
        note: 'Traffic delay',
      };

      const result: Attendance = {
        id: 1,
        student: { id: 1 } as any,
        date: new Date('2023-04-25'),
        status: AttendanceStatus.LATE,
        note: 'Traffic delay',
      };

      mockAttendanceRepository.updateAttendance.mockResolvedValue(result);

      expect(await service.update(1, updateDto)).toBe(result);
      expect(mockAttendanceRepository.updateAttendance).toHaveBeenCalledWith(
        1,
        updateDto,
      );
    });
  });

  describe('removeAttendance', () => {
    it('should delete an attendance record', async () => {
      mockAttendanceRepository.deleteAttendance.mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.not.toThrow();
      expect(mockAttendanceRepository.deleteAttendance).toHaveBeenCalledWith(1);
    });
  });
});
