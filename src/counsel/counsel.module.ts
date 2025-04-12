import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Counsel } from './counsel.entity';
import { CounselService } from './counsel.service';
import { CounselController } from './counsel.controller';
import { CounselRepository } from './counsel.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Counsel])],
  controllers: [CounselController],
  providers: [CounselService, CounselRepository],
})
export class CounselModule {}
