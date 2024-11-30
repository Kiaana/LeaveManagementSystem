// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';
import { useRouter } from 'next/router';

const AuthContext = createContext();

// 不需要认证的路由列表
const PUBLIC_ROUTES = [
  '/login',
  '/',
  '/major_overview',
  '/major/[major]',
  '/duty_info',
  '/overview',
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 检查当前路由是否需要认证
  const isPublicRoute = (path) => {
    return PUBLIC_ROUTES.some(route => path === route || path.startsWith(route));
  };

  const checkAuth = async () => {
    // 如果是公开路由，不检查认证
    if (isPublicRoute(router.pathname)) {
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get('/user');
      setUser(response.data);
    } catch (error) {
      setUser(null);
      if (!isPublicRoute(router.pathname)) {
        router.push(`/login?redirect=${encodeURIComponent(router.pathname)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [router.pathname]);

  const login = async (credentials) => {
    const response = await axiosInstance.post('/login', credentials);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/logout');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);