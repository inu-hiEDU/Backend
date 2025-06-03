import {
  Body,
  Controller,
  Post,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ParentService } from './parent.service';
import { Parent } from './parent.entity';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CreateParentDto } from './dto/create-parent.dto';
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
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid userId');
    }
    return this.parentService.createParent({ ...data, userId });
  }
}
