import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from '../src/students/student.service';
import { StudentRepository } from '../src/students/student.repository';
import { Student } from '../src/students/student.entity';
import { CreateStudentDto } from '../src/students/dto/create-student.dto';
import { UpdateStudentDto } from '../src/students/dto/update-student.dto';
import { User } from '../src/user/user.entity';
import { UserRole } from '../src/user/user-role.enum';

describe('StudentService', () => {
  let service: StudentService;
  let repository: StudentRepository;

  const mockStudentRepository = {
    findAll: jest.fn(),
    findOneById: jest.fn(),
    createStudent: jest.fn(),
    updateStudent: jest.fn(),
    deleteStudent: jest.fn(),
    findByGradeAndClassroom: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: StudentRepository,
          useValue: mockStudentRepository,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    repository = module.get<StudentRepository>(StudentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllStudents', () => {
    it('should return an array of students', async () => {
      const result: Student[] = [
        {
          id: 1,
          studentNum: 20202,  // studentNum에 값을 명시적으로 설정
          name: '홍길동',
          grade: 2,
          classroom: 1,
          phoneNum: '010-2020-2020',
          birthday: '2020-02-02',
          user: {
            id: 1,
            email: 'test@example.com',  // 필수 속성 추가
            password: 'password',      // 필수 속성 추가
            role: UserRole.STUDENT,    // 필수 속성 추가
            name: '홍길동',
          },
        },
      ];
      mockStudentRepository.findAll.mockResolvedValue(result);

      expect(await service.getAllStudents()).toBe(result);
      expect(mockStudentRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('createStudent', () => {
    it('should create and return a student', async () => {
      const createDto: CreateStudentDto = {
        studentNum: 20202,  // studentNum을 명시적으로 설정
        name: '홍길동',
        grade: 2,   // CreateStudentDto에서 grade 속성 추가
        classroom: 1, // CreateStudentDto에서 classroom 속성 추가
        phoneNum: '010-2020-2020',
        birthday: '2020-02-02',
      };

      const result: Student = {
        id: 1,
        ...createDto,
        user: {
          id: 1,
          email: 'test@example.com',  // user 속성 필수 속성 추가
          password: 'password',       // user 속성 필수 속성 추가
          role: UserRole.STUDENT,     // user 속성 필수 속성 추가
          name: '홍길동',
        },
      };
      mockStudentRepository.createStudent.mockResolvedValue(result);

      expect(await service.createStudent(createDto)).toBe(result);
      expect(mockStudentRepository.createStudent).toHaveBeenCalledWith(createDto);
    });
  });

  describe('updateStudent', () => {
    it('should update and return the student', async () => {
      const updateDto: UpdateStudentDto = {
        studentNum: 20202,  // studentNum을 명시적으로 설정
        name: '홍길동',
        grade: 3,
        classroom: 2,
        phoneNum: '010-2020-2020',
        birthday: '2020-02-02',
      };
      const result: Student = {
        id: 1,
        studentNum: 20202,
        name: '홍길동',
        grade: 2,
        classroom: 1,
        phoneNum: '010-2020-2020',
        birthday: '2020-02-02',
        user: {
          id: 1,
          email: 'test@example.com',
          password: 'password',
          role: UserRole.STUDENT,
          name: '홍길동',
        },
      };
      mockStudentRepository.updateStudent.mockResolvedValue(result);

      expect(await service.updateStudent(1, updateDto)).toBe(result);
      expect(mockStudentRepository.updateStudent).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('deleteStudent', () => {
    it('should delete a student', async () => {
      mockStudentRepository.deleteStudent.mockResolvedValue(undefined);

      await expect(service.deleteStudent(1)).resolves.not.toThrow();
      expect(mockStudentRepository.deleteStudent).toHaveBeenCalledWith(1);
    });
  });
});
