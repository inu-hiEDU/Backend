import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentController } from './parent.controller';
import { ParentService } from './parent.service';
import { ParentRepository } from './parent.repository';
import { Parent } from './parent.entity';
import { Student } from '../students/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parent, Student])],
  controllers: [ParentController],
  providers: [ParentService, ParentRepository],
})
export class ParentModule {}