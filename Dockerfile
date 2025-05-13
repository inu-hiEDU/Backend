# Node.js 베이스 이미지 (경량 버전)
FROM node:20-alpine AS builder

# 컨테이너 안의 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# Dependency 설치
RUN npm install && npm cache clean --force

# 소스코드 복사
COPY . .

# 환경변수

# TS를 JS로 빌드
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# 앱이 열 포트
EXPOSE 3000

# 앱 실행 명령
CMD ["node", "dist/main"]