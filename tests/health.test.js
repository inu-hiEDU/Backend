import { check, sleep } from 'k6';
import http from 'k6/http';

export let options = {
  stages: [
    { duration: '5s', target: 10 }, // 10초 동안 사용자 수를 10명까지 증가
    { duration: '3s', target: 10 }, // 10명의 사용자 상태 유지
    { duration: '5s', target: 0 }, // 사용자 수를 0으로 감소
  ],
};

export default function () {
  const res = http.get('http://app:3000/api/health');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'body is healthy': (r) => r.body.includes('OK'),
  });

  sleep(1);
}
