# 1단계: 빌드 단계
FROM node:20.11.1-alpine AS builder

# 컨테이너 안의 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# Dependency 설치
RUN npm install && npm cache clean --force

# 소스코드 복사
COPY . .

# TS를 JS로 빌드
RUN npm run build

# 2단계: 런타임 단계
FROM node:20.11.1-alpine

# 컨테이너 안의 작업 디렉토리 설정
WORKDIR /app

# 빌드된 파일과 의존성만 복사
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# 프로덕션 의존성만 설치
RUN npm install --only=production && npm cache clean --force

# 앱이 열 포트
EXPOSE 3000

# 앱 실행 명령
CMD ["npm", "run", "start:prod"]
