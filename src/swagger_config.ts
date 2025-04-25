import { DocumentBuilder } from '@nestjs/swagger';

export function swaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Students API') // API 제목
    .setDescription('The Students API description') // API 설명
    .setVersion('1.0') // API 버전
    .addTag('students') // 'students' 태그로 묶기
    .build(); // Swagger 설정 객체 반환
}