import { Controller, Get, Delete, Body, Patch, Query } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { Scores } from './scores.entity';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Patch()
  async createScore(@Body() body: Scores) {
    const { studentId, grade, semester, ...subjects } = body;
    const subjectField = this.mapSubjectToField(Object.keys(subjects)[0]);
    const value = Object.values(subjects)[0];

    return await this.scoresService.createScore(studentId, grade, semester, subjectField, value);
  }

  @Get()
  async getScore(@Query('studentId') studentId: number, @Query('semester') semester: number) {
    return await this.scoresService.getScore(studentId, semester);
  }

  @Delete()
  async deleteScore(@Query('studentId') studentId: number) {
    return await this.scoresService.deleteScore(studentId);
  }

  private mapSubjectToField(subject: string): keyof Scores {
    const map = {
      '국어': 'subject1',
      '수학': 'subject2',
      '영어': 'subject3',
      '사회': 'subject4',
      '과학': 'subject5',
      '체육': 'subject6',
      '미술': 'subject7',
      '음악': 'subject8',
    };

    return map[subject];
  }
}
