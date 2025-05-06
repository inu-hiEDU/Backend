import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { AppModule } from './app.module';
import { swaggerConfig } from './swagger_config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'production') {
    app.use(
      ['/swagger', '/swagger-json'],
      basicAuth({
        challenge: true,
        users: {
          admin: '1234', // <-- 원하는 ID/PW 설정
        },
      }),
    );
  }

  app.enableCors({
    origin: 'http://localhost:3012', // 프론트 포트와 맞게!
  });

  const { documentConfig, swaggerOptions } = swaggerConfig();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('swagger', app, document, swaggerOptions);

  app.enableCors({
    origin: 'http://localhost:3012', // 프론트 포트와 맞게!
  });

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
  console.log('Servcer is running on http://localhost:3000');
}

bootstrap();
