// services/axiosConfig.js
import axios from 'axios';

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

    // 如果是 401 错误且不是重试请求
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 尝试刷新令牌
        await axios.post('/api/refresh', {}, { withCredentials: true });
        // 重试原始请求
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 如果刷新失败，重定向到登录页
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;