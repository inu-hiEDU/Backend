import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ description: '학번', example: '20202' })
  studentNum: number;

  @ApiProperty({ description: '이름', example: '홍길동' })
  name: string;

  @ApiProperty({ description: '학년', example: '2' })
  grade: number;

  @ApiProperty({ description: '반', example: '2' })
  classroom: number;

  @ApiProperty({ description: '전화번호', example: '010-2020-2020' })
  phoneNum: string;

  @ApiProperty({ description: '생일', example: '2020-02-02' })
  birthday: string;

  @ApiProperty({ description: '사진 URL', example: 'https://...' })
  picture?: string;

  @ApiProperty({ description: '유저아이디', example: '12' })
  userId: number;
}
