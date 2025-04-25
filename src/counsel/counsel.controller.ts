import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  HttpCode
} from '@nestjs/common';
import { CounselService } from './counsel.service';
import { CreateCounselDto } from './dto/create-counsel.dto';
import { UpdateCounselDto } from './dto/update-counsel.dto';
// import { Roles } from '../auth/roles.decorator';
// import { UserRole } from '../user/user-role.enum';

@Controller('counsels')
export class CounselController {
  constructor(private readonly counselService: CounselService) {}

  @Post()
  // @Roles(UserRole.TEACHER)
  create(@Body() dto: CreateCounselDto) {
    return this.counselService.create(dto);
  }

  @Get()
  // @Roles(UserRole.TEACHER)
  findAll(
    @Query('studentId') studentId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.counselService.findAll(studentId, startDate, endDate);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.counselService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCounselDto) {
    return this.counselService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.counselService.remove(id);
  }
}
