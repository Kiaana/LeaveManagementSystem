// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';
import { useRouter } from 'next/router';

const AuthContext = createContext();

// 公开路由列表
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

  // 判断是否是公开路由
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
      setLoading(false);
    }
  };

  // 初始化时总是检查会话
  useEffect(() => {
    restoreSession();
  }, []);

  // 路由变化时检查认证
  useEffect(() => {
    const checkAuth = async () => {
      // 如果正在加载，不进行检查
      if (loading) return;
      
      // 如果是公开路由，不需要重定向
      if (isPublicRoute(router.pathname)) {
        return;
      }

      // 非公开路由且未登录时重定向
      if (!user) {
        router.push(`/login?redirect=${encodeURIComponent(router.pathname)}`);
      }
    };

    checkAuth();
  }, [router.pathname, user, loading]);

  // 登录方法
  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post('/login', credentials);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // 登出方法
  const logout = async () => {
    try {
      await axiosInstance.post('/logout');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 更新用户信息方法
  const updateUser = (newUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...newUserData
    }));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout, 
        updateUser, 
        isPublicRoute 
      }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};