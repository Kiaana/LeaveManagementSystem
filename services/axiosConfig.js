// services/axiosConfig.js
import axios from 'axios';

// 公开路由列表 - 与 AuthContext 保持一致
const PUBLIC_ROUTES = [
  '/login',
  '/',
  '/major_overview',
  '/major/[major]',
  '/duty_info',
  '/overview',
];

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 判断是否是公开路由
const isPublicRoute = (path) => {
  return PUBLIC_ROUTES.some(route => {
    // 移除 baseURL，只比较路径部分
    const urlPath = path.replace(process.env.NEXT_PUBLIC_API_URL, '');
    return urlPath === route || urlPath.startsWith(route);
  });
};

// 添加请求拦截器处理 cookies
axiosInstance.interceptors.request.use(
  (config) => {
    // 确保每个请求都携带 credentials
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 判断请求类型
    const isLoginRequest = originalRequest.url === '/login';
    const isRefreshRequest = originalRequest.url === '/refresh';
    const isPublicUrl = isPublicRoute(originalRequest.url);

    // 如果是公开路由，直接返回错误
    if (isPublicUrl) {
      return Promise.reject(error);
    }

    // 如果是401错误且不是重试请求且不是登录或刷新请求
    if (error.response?.status === 401 
        && !originalRequest._retry 
        && !isLoginRequest 
        && !isRefreshRequest) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axiosInstance.post('/refresh', {});

        if (refreshResponse.status === 200) {
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        if (!window.location.pathname.includes('/login')) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;