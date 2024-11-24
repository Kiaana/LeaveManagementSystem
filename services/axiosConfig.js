// services/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 确保 Axios 请求携带 Cookie
});

export default axiosInstance;