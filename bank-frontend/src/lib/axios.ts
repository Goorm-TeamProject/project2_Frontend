import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 주소
  withCredentials: true, // 필요 시 쿠키 사용
});

instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  

export default instance;
