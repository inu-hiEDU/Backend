import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { AppModule } from './app.module';
import { swaggerConfig } from './swagger_config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: [
      'http://localhost:3012',
      'https://hiedu.site',
      'https://hiedu-frontend.vercel.app',
      'https://hiedu.vercel.app',
    ], // 허용할 도메인
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // 쿠키를 포함한 요청 허용
  });

  // Swagger 인증 환경변수 기반 처리
  if (process.env.SWAGGER_USER && process.env.SWAGGER_PASS) {
    app.use(
      ['/api/swagger', '/api/swagger-json'],
      basicAuth({
        challenge: true,
        users: {
          [process.env.SWAGGER_USER]: process.env.SWAGGER_PASS,
        },
      }),
    );
  }

  const { documentConfig, swaggerOptions } = swaggerConfig();
  const document = SwaggerModule.createDocument(app, documentConfig);

  SwaggerModule.setup('api/swagger', app, document, swaggerOptions);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
  console.log('Swagger is running on http://localhost:3000');
}

bootstrap();
