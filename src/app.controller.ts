import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller('api')
export class AppController {
  @Get('/health')
  getHealth(): string {
    return 'OK';
  }
}
