import axios from 'axios';

// API 기본 설정
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

export const apiClient = axios.create({
  baseURL: 'https://blackspoondev-sandbox.mxapps.io/rest/apiservice/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// // 요청 인터셉터: 모든 요청에 토큰 추가
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('auth_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // 응답 인터셉터: 인증 실패 처리
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // 인증 실패 시 토큰 제거 및 로그인 페이지로 리다이렉트
//       localStorage.removeItem('auth_token');
//       // window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );
