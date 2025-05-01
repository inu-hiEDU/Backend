import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('api')
export class AppController {
  @Get('/health')
  @ApiExcludeEndpoint()
  getHealth(): string {
    return 'OK';
  }
}
