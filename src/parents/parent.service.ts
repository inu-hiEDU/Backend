import { Injectable } from '@nestjs/common';
import { ParentRepository } from './parent.repository';
import { Parent } from './parent.entity';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';

@Injectable()
export class ParentService {
  constructor(private readonly parentRepository: ParentRepository) {}

  async createParent(data: CreateParentDto & { userId: number }): Promise<Parent> {
    return this.parentRepository.createParent(data);
  }

  async findAll(): Promise<Parent[]> {
    return this.parentRepository.findAll();
  }

  async findOne(id: number): Promise<Parent | null> {
    return this.parentRepository.findOneById(id);
  }

  async update(id: number, data: UpdateParentDto): Promise<Parent> {
    return this.parentRepository.updateParent(id, data);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    return this.parentRepository.deleteParent(id);
  }
}
