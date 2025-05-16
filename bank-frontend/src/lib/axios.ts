import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

//accessToken 만료 시 /refresh 요청 → 원래 요청 재시도
instance.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/login") &&
      !originalRequest.url?.includes("/join") &&
      !originalRequest.url?.includes("/refresh")
    ) {
      originalRequest._retry = true;

      try {
        await instance.post("/refresh"); // refreshToken은 쿠키로 전송됨

        // 👉 기존 요청 다시 시도
        return instance(originalRequest);
      } catch (refreshErr) {
        console.warn("❌ 토큰 자동 재발급 실패", refreshErr);
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
