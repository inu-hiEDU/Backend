import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../students/student.entity';
import { ScoresController } from './score.controller';
import { Scores } from './score.entity';
import { ScoresService } from './score.service';

@Module({
  imports: [TypeOrmModule.forFeature([Scores, Student])],
  controllers: [ScoresController],
  providers: [ScoresService],
})
export class ScoresModule {}
