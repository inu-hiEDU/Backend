import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiCreate,
  ApiDelete,
  ApiFind,
  ApiGet,
  ApiUpdate,
} from '../swagger_config';
import { CounselService } from './counsel.service';
import { CreateCounselDto } from './dto/create-counsel.dto';
import { UpdateCounselDto } from './dto/update-counsel.dto';
import { AuthGuard } from '@nestjs/passport';

// import { Roles } from '../auth/roles.decorator';
// import { UserRole } from '../user/user-role.enum';

@ApiTags('상담')
@Controller('api/counsels')
export class CounselController {
  constructor(private readonly counselService: CounselService) {}

  @Post()
  @ApiBearerAuth('teacher')
  @ApiCreate('상담 정보 생성', CreateCounselDto)
  @UseGuards(AuthGuard('jwt'))
  // @Roles(UserRole.TEACHER)
  create(@Body() dto: CreateCounselDto, @Req() req) {
    const userId = req.user.userId;
    return this.counselService.create(dto, userId);
  }

  @Get()
  @ApiFind('상담 정보 필터링')
  // @Roles(UserRole.TEACHER)
  findAll(
    @Query('studentId') studentId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.counselService.findAll(studentId, startDate, endDate);
  }

  @Get(':id')
  @ApiGet('상담 정보 개별 조회')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = Number(req.user.userId);
    return this.counselService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiUpdate('상담 정보 수정', UpdateCounselDto)
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCounselDto,
    @Req() req,
  ) {
    const userId = Number(req.user.userId);
    return this.counselService.update(id, dto, userId);
  }

  @Delete(':id')
  @ApiDelete('상담 정보 삭제')
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = Number(req.user.userId);
    return this.counselService.remove(id, userId);
  }
}
