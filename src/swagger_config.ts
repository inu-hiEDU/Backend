import { DocumentBuilder } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';

// 전체 Swagger 문서 설정
export function swaggerConfig() {
  const documentConfig = new DocumentBuilder()
    .setTitle('HiEdu')
    .setDescription('swagger')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: '교사용 토큰',
        name: 'teacher-token',
        in: 'header',
      },
      'teacher', // <-- security name (identifier)
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: '학생용 토큰',
        name: 'student-token',
        in: 'header',
      },
      'student', // <-- security name
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: '학부모용 토큰',
        name: 'parent-token',
        in: 'header',
      },
      'parent',
    )
    .build();

  const swaggerOptions = {
    swaggerOptions: {
      authAction: {
        teacher: {
          name: 'Authorization',
          schema: {
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItaWQiLCJlbWFpbCI6InRlc3QxQGdtYWlsLmNvbSIsIm5hbWUiOiLrsJXquLDshJ0iLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc0NjA5NDExOCwiZXhwIjoxNzQ4Njg2MTE4fQ.dodBCcmVND3QRpAhFxVdAP--rTzSDMwBE5Cyz_F7rb8'
        },
        student: {
          name: 'Authorization',
          schema: {
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItaWQiLCJlbWFpbCI6InRlc3QxQGdtYWlsLmNvbSIsIm5hbWUiOiLrsJXquLDshJ0iLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc0NjA5MDAxNiwiZXhwIjoxNzQ4NjgyMDE2fQ.geJk1I48M6T8SsCziDpckhT4Lhv9YMDQsu5VeCe0aI4',
        },
        parent: {
          name: 'Authorization',
          schema: {
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItaWQiLCJlbWFpbCI6InRlc3QxQGdtYWlsLmNvbSIsIm5hbWUiOiLrsJXquLDshJ0iLCJyb2xlIjoicGFyZW50IiwiaWF0IjoxNzQ2MDkwMDczLCJleHAiOjE3NDg2ODIwNzN9.Nfm3vRb2AzkGmrs79pgoupBhZvidXoq-ioPWU31WI8w',
        },
      },
    },
  };

  return { documentConfig, swaggerOptions };
}

// 메소드별 Swagger 데코레이터
// @ApiBearerAuth() <- 인증토큰이 필요한 api에 추가하기
// @ApiBearerAuth('teacher')  // <-- 여기서 어떤 역할의 토큰을 요구하는지 지정

export function ApiCreate(summary: string, dto: any) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 201, description: '성공' }),
    ApiBody({ type: dto }),
  );
}

export function ApiFind(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 200, description: '성공' }),
    ApiQuery({ name: 'studentId', type: String, description: '학생 id', required: false }),
    ApiQuery({ name: 'startDate', type: String, description: '시작 날짜', required: false }),
    ApiQuery({ name: 'endDate', type: String, description: '마지막 날짜', required: false }),
  );
}

export function ApiGet(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 200, description: '성공' }),
    ApiParam({ name: 'id', type: String, description: '정보 id' }),
  );
}

export function ApiUpdate(summary: string, dto: any) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 200, description: '성공' }),
    ApiParam({ name: 'id', type: String, description: '정보 id' }),
    ApiBody({ type: dto }),
  );
}

export function ApiDelete(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 204, description: '성공' }),
    ApiParam({ name: 'id', type: String, description: '정보 id' }),
  );
}
