import { Injectable } from '@nestjs/common';
import { ParentRepository } from './parent.repository';
import { Parent } from './parent.entity';
import { CreateParentDto } from './dto/create-parent.dto';

@Injectable()
export class ParentService {
  constructor(private readonly parentRepository: ParentRepository) {}

  async createParent(data: CreateParentDto & { userId: number }): Promise<Parent> {
    return this.parentRepository.createParent(data);
  }
}