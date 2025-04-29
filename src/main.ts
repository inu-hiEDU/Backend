import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './swagger_config';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'production'){
    app.use(
      ['/swagger', '/swagger-json'],
      basicAuth({
        challenge: true,
        users: {
          'admin': '1234',  // <-- 원하는 ID/PW 설정
        },
      }),
    );
  }

  const { documentConfig, swaggerOptions } = swaggerConfig();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('swagger', app, document, swaggerOptions);
  

  await app.listen(process.env.PORT ?? 3000);
  console.log('Servcer is running on http://localhost:3000');
}

bootstrap();