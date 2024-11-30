// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';
import { tokenStorage } from '../utils/tokenStorage';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 初始化检查令牌和用户信息
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStorage.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get('/user');
        setUser(response.data);
      } catch (error) {
        tokenStorage.clearAll();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const response = await axiosInstance.post('/login', credentials);
    const { access_token, refresh_token, user: userData } = response.data;
    
    tokenStorage.setToken(access_token);
    tokenStorage.setRefreshToken(refresh_token);
    setUser(userData);
    
    return response.data;
  };

  const logout = () => {
    tokenStorage.clearAll();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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