// services/axiosConfig.js
import axios from 'axios';
import { useRouter } from 'next/router';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 判断是否是登录请求
    const isLoginRequest = originalRequest.url === '/login';

    // 如果是 401 错误且不是重试请求且不是登录请求
    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post('/refresh', {});
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 如果不是登录页面，才重定向
        if (!window.location.pathname.includes('/login')) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
        return Promise.reject(refreshError);
      }
    }

    // 登录失败直接返回错误
    if (isLoginRequest) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;