import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scores } from './score.entity';
import { ScoresService } from './score.service';
import { ScoresController } from './score.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Scores])],
  controllers: [ScoresController],
  providers: [ScoresService],
})
export class ScoresModule {}
