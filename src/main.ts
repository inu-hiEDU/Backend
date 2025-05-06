import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { AppModule } from './app.module';
import { swaggerConfig } from './swagger_config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 배포 환경에서도 Swagger 접근 허용 + 기본 인증 적용
  app.use(
    ['/swagger', '/swagger-json'],
    basicAuth({
      challenge: true,
      users: {
        admin: process.env.SWAGGER_USER || 'admin',
        [process.env.SWAGGER_USER || 'admin']:
          process.env.SWAGGER_PASS || '1234',
      },
    }),
  );

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
  console.log('Server is running on http://localhost:3000');
}

bootstrap();
