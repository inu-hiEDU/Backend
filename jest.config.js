module.exports = {
    preset: 'ts-jest',  // ts-jest를 사용하여 TypeScript 코드 실행
    testEnvironment: 'node',  // 테스트 환경을 Node.js로 설정
    moduleFileExtensions: ['js', 'ts'],  // 테스트 파일 확장자
    testMatch: ['**/tests/**/*.test.ts'],  // 테스트 파일 경로 (tests 폴더 내 .test.ts 파일)
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',  // .ts 파일을 ts-jest로 변환하여 실행
    },
    collectCoverageFrom: [
      'src/**/*.ts',  // src 폴더 내의 TypeScript 파일에 대해 코드 커버리지 수집
    ],
    testPathIgnorePatterns: ['/node_modules/'],  // node_modules 폴더 제외
    verbose: true,  // 테스트 실행 시 더 많은 정보 출력
  };
  