import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Patch,
  Param,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Teacher } from '../teachers/teacher.entity';

@Controller('/api/admin/teachers')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  getAllTeachers(): Promise<Teacher[]> {
    return this.adminService.getAllTeachers();
  }

  @Post()
  createTeacher(
    @Body()
    body: {
      name: string;
      phoneNum: string;
      birthday: string;
      userId: number;
    },
  ): Promise<Teacher> {
    return this.adminService.createTeacher(body);
  }

  @Patch(':id')
  updateTeacher(
    @Param('id') id: string,
    @Body() body: Partial<Teacher>,
  ): Promise<Teacher> {
    return this.adminService.updateTeacher(id, body);
  }

  @Delete(':id')
  deleteTeacher(@Param('id') id: string): Promise<void> {
    return this.adminService.deleteTeacher(id);
  }
}
