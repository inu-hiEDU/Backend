import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthRequest } from './auth/auth-request.interface';
import { JwtAuthGuard } from './auth/jwt.guard';
import { UserService } from './user/user.service';

@Controller('main')
export class MainController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMainData(@Req() req: AuthRequest) {
    const user = req.user;

    const userInfo = await this.userService.findUserById(Number(user.userId));

    return {
      message: `어서오세요! ${userInfo.name}`,
      userInfo: {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        role: userInfo.role,
      },
    };
  }
}
