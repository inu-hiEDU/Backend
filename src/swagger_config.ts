import { DocumentBuilder } from '@nestjs/swagger';

export function swaggerConfig() {
  return new DocumentBuilder()
    .setTitle('HiEdu')
    .setDescription('swagger')
    .setVersion('1.0')
    .build();
}