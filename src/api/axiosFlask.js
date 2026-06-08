// api/axiosFlask.ts
import axios from "axios";

export const axiosFlask = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://8.232.7.222",
  withCredentials: true,              // Gateway 세션 인증 필요
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

// (선택) 요청 크기 큰 경우만 따로 처리(파일 X권장)
axiosFlask.interceptors.request.use((config) => {
  // Flask는 CSRF 안 쓰므로 X-CSRF-Token 붙이지 않음
  return config;
});