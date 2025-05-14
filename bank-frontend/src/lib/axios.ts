import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true, // ✅ 쿠키 전송 허용
  headers: {
    "Content-Type": "application/json",
  },
});

// ❌ Authorization 헤더 추가 로직 제거
// ✅ interceptor 삭제해도 됨

export default instance;
