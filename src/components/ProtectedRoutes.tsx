'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
// import { useAuth } from '@/context/AuthContext';
import { useAuthStore } from '../store/AuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuthStore();
  const token = Cookies.get('auth_token');
  const router = useRouter();

  useEffect(() => {
    console.log('User:', user, 'Token:', token);

    if (!user || !token) {
      router.replace('/login'); // Redirect to login if not authenticated
    }
  }, [user, token, router]);

  if (!user || !token) {
    return null; // Prevents flickering while redirecting
  }

  return <>{children}</>;
};

export default ProtectedRoute;
