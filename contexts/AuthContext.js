// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';
import { useRouter } from 'next/router';

const AuthContext = createContext();

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
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  const isPublicRoute = (path) => {
    return PUBLIC_ROUTES.some(route => path === route || path.startsWith(route));
  };

  // 恢复用户会话
  const restoreSession = async () => {
    try {
      const response = await axiosInstance.get('/user');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setInitialized(true);
      setLoading(false);
    }
  };

  // 初始化时检查会话
  useEffect(() => {
    restoreSession();
  }, []);

  // 路由变化时检查认证
  useEffect(() => {
    if (!initialized) return;

    const checkAuth = async () => {
      // 如果是公开路由，不检查认证
      if (isPublicRoute(router.pathname)) {
        setLoading(false);
        return;
      }

      // 如果没有用户且不是公开路由，重定向到登录页
      if (!user && !isPublicRoute(router.pathname)) {
        router.push(`/login?redirect=${encodeURIComponent(router.pathname)}`);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [router.pathname, user, initialized]);

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
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);