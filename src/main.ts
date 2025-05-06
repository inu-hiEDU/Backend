import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { AppModule } from './app.module';
import { swaggerConfig } from './swagger_config';

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

  app.enableCors({
    origin: [
      'http://localhost:3012',
      'https://hiedu-259eujhfe-seunggons-projects.vercel.app/',
    ],
  });

  const { documentConfig, swaggerOptions } = swaggerConfig();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('swagger', app, document, swaggerOptions);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
  console.log('Swagger is running on http://localhost:3000');
}

bootstrap();
