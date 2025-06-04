import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Req,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ParentService } from './parent.service';
import { Parent } from './parent.entity';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { AuthRequest } from '../auth/auth-request.interface';

@ApiTags('학부모')
@Controller('api/parents')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @ApiOperation({ summary: '학부모 등록' })
  @ApiBody({ type: CreateParentDto })
  @Post()
  async createParent(
    @Body() data: CreateParentDto,
    @Req() req: AuthRequest,
  ): Promise<Parent> {
    const userId = Number(req.user.userId);
    if (isNaN(userId)) throw new BadRequestException('Invalid userId');
    return this.parentService.createParent({ ...data, userId });
  }

  @ApiOperation({ summary: '모든 학부모 조회' })
  @Get()
  async findAll(): Promise<Parent[]> {
    return this.parentService.findAll();
  }

  @ApiOperation({ summary: '특정 학부모 조회' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Parent> {
    const parent = await this.parentService.findOne(+id);
    if (!parent) throw new NotFoundException('Parent not found');
    return parent;
  }

  @ApiOperation({ summary: '학부모 수정' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateParentDto,
  ): Promise<Parent> {
    return this.parentService.update(+id, data);
  }

  @ApiOperation({ summary: '학부모 삭제' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.parentService.remove(+id);
  }
}
