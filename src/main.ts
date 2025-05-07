import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { AppModule } from './app.module';
import { swaggerConfig } from './swagger_config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 인증을 환경변수 기반으로 처리
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

  // CORS 설정
  app.enableCors({
<<<<<<< HEAD
    origin: ['http://localhost:3012', 'https://hiedu.site'], // 허용할 도메인
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // 쿠키를 포함한 요청 허용
=======
    origin: [
      'http://localhost:3012',
      'https://hiedu-259eujhfe-seunggons-projects.vercel.app/',
    ],
>>>>>>> 1682829381bfebd6500a9e4e6a46aeae03a07285
  });

  const { documentConfig, swaggerOptions } = swaggerConfig();
  const document = SwaggerModule.createDocument(app, documentConfig);
<<<<<<< HEAD
  SwaggerModule.setup('swagger', app, document, swaggerOptions);
=======
  SwaggerModule.setup('api/swagger', app, document, swaggerOptions);
>>>>>>> 1682829381bfebd6500a9e4e6a46aeae03a07285

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
  console.log('Swagger is running on http://localhost:3000');
}

bootstrap();
