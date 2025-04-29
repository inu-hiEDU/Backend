import { DocumentBuilder } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';

const TEST_TOKEN = '테스트용 토큰';

// 전체 Swagger 문서 설정
export function swaggerConfig() {
  const documentConfig = new DocumentBuilder()
    .setTitle('HiEdu')
    .setDescription('swagger')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerOptions = {
    swaggerOptions: {
      authAction: {
        bearer: {
          name: 'Authorization',
          schema: {
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: TEST_TOKEN, // 여기 자동 토큰
        },
      },
    },
  };

  return { documentConfig, swaggerOptions };
}

// 메소드별 Swagger 데코레이터
// @ApiBearerAuth() <- 인증토큰이 필요한 api에 추가하기
// @ApiHideProperty() <- dto 필드 숨길 때
// @ApiExcludeEndpoint() <- 엔드포인트 숨길 때

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
