import { DocumentBuilder } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';

// 전체 Swagger 문서 설정
export function swaggerConfig() {
  return new DocumentBuilder()
    .setTitle('HiEdu')
    .setDescription('swagger')
    .setVersion('1.0')
    .build();
}

// 메소드별 Swagger 데코레이터

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
