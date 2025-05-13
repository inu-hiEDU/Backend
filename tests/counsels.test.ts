import { Test, TestingModule } from '@nestjs/testing';
import { Counsel } from '../src/counsel/counsel.entity';
import { CounselRepository } from '../src/counsel/counsel.repository';
import { CounselService } from '../src/counsel/counsel.service';
import { UpdateCounselDto } from '../src/counsel/dto/update-counsel.dto';

describe('CounselService', () => {
  let service: CounselService;
  let repository: CounselRepository;

  const mockCounselRepository = {
    createCounsel: jest.fn(),
    findByFilter: jest.fn(),
    findById: jest.fn(),
    updateCounsel: jest.fn(),
    deleteCounsel: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CounselService,
        {
          provide: CounselRepository,
          useValue: mockCounselRepository,
        },
      ],
    }).compile();

    service = module.get<CounselService>(CounselService);
    repository = module.get<CounselRepository>(CounselRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllCounsel', () => {
    it('should return an array of counsel records', async () => {
      const result: Counsel[] = [
        {
          id: 1,
          student: { id: 1 } as any,
          date: new Date('2023-04-25'),
          content: '상담 내용',
        },
      ];

      mockCounselRepository.findByFilter.mockResolvedValue(result);

      // Call findAll with no parameters
      const counselRecords = await service.findAll();
      expect(counselRecords).toEqual(result);
      expect(mockCounselRepository.findByFilter).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
      );
    });

    it('should return filtered counsel records when studentId is provided', async () => {
      const result: Counsel[] = [
        {
          id: 1,
          student: { id: 1 } as any,
          date: new Date('2023-04-25'),
          content: '상담 내용',
        },
      ];

      const studentId = 1;
      mockCounselRepository.findByFilter.mockResolvedValue(result);

      // Call findAll with a studentId
      const counselRecords = await service.findAll(studentId);

      expect(counselRecords).toEqual(result);
      expect(mockCounselRepository.findByFilter).toHaveBeenCalledWith(
        studentId,
        undefined,
        undefined,
      );
    });
  });

  describe('findOneCounsel', () => {
    it('should return a single counsel record by id', async () => {
      const result: Counsel = {
        id: 1,
        student: { id: 1 } as any,
        date: new Date('2023-04-25'),
        content: '상담 내용',
      };

      mockCounselRepository.findById.mockResolvedValue(result);

      expect(await service.findOne(1)).toBe(result);
      expect(mockCounselRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateCounsel', () => {
    it('should update and return the counsel record', async () => {
      const updateDto: UpdateCounselDto = {
        content: 'Updated 상담 내용',
      };

      const result: Counsel = {
        id: 1,
        student: { id: 1 } as any,
        date: new Date('2023-04-25'),
        content: updateDto.content!,
      };

      mockCounselRepository.updateCounsel.mockResolvedValue(result);

      expect(await service.update(1, updateDto)).toBe(result);
      expect(mockCounselRepository.updateCounsel).toHaveBeenCalledWith(
        1,
        updateDto,
      );
    });
  });

  describe('removeCounsel', () => {
    it('should delete a counsel record', async () => {
      mockCounselRepository.deleteCounsel.mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.not.toThrow();
      expect(mockCounselRepository.deleteCounsel).toHaveBeenCalledWith(1);
    });
  });
});
