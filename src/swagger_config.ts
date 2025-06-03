import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  DocumentBuilder,
} from '@nestjs/swagger';

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
          value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMyIsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwibmFtZSI6Iuuwleq4sOyEnSIsInJvbGUiOiJURUFDSEVSIiwiaWF0IjoxNzQ4OTI0NDI0LCJleHAiOjE3NTE1MTY0MjR9.oiRCS73fU_CNrxa6wqJtHg4ZPAaKS82lvgDw1rIMHwE'
        },
        student: {
          name: 'Authorization',
          schema: {
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNiIsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwibmFtZSI6Iu2VmeyDnSIsInJvbGUiOiJTVFVERU5UIiwiaWF0IjoxNzQ4OTM0MjA1LCJleHAiOjE3NTE1MjYyMDV9.wm4OGojR34XoDFAjYkIXkqS_nEbz0j6DyhP7QBgCwpE',
        },
        parent: {
          name: 'Authorization',
          schema: {
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MCIsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwibmFtZSI6Iu2Vmeu2gOuqqCIsInJvbGUiOiJQQVJFTlQiLCJpYXQiOjE3NDg5MzQyNjMsImV4cCI6MTc1MTUyNjI2M30.cNQFaHnrJLBvzvI4L9menmiacWRHwMwMZlJYUKUt0Mg',
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
    ApiQuery({
      name: 'studentId',
      type: String,
      description: '학생 id',
      required: false,
    }),
    ApiQuery({
      name: 'startDate',
      type: String,
      description: '시작 날짜',
      required: false,
    }),
    ApiQuery({
      name: 'endDate',
      type: String,
      description: '마지막 날짜',
      required: false,
    }),
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
