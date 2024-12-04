// components/ProtectedRoute.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 检查用户是否有权限
  const hasRequiredRole = () => {
    if (!requiredRole || !user) return false;
    
    // 处理权限数组
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    // 处理单个权限
    return user.role === requiredRole;
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
      } else if (requiredRole && !hasRequiredRole()) {
        router.push('/unauthorized');
      }
    }
  }, [user, loading, router, requiredRole]);

  if (loading || !user) {
    return null;
  }

  if (requiredRole && !hasRequiredRole()) {
    return null;
  }

  return children;
};

export default ProtectedRoute;