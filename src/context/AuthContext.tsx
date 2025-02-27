'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = Cookies.get('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const getToken = () => Cookies.get('auth_token');

  const login = (userData: User, token: string) => {
    Cookies.set('user', JSON.stringify(userData), { expires: 7, path: '/' });
    Cookies.set('auth_token', token, { expires: 7, path: '/' });
    console.log('Auth token & user:', token, userData);
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('user');
    Cookies.remove('auth_token');
    console.log('Cookies cleared');
    setUser(null);
  };

  useEffect(() => {
    const token = getToken();
    if (!user && !token) {
      logout();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
