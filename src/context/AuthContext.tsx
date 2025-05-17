'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isAuthenticated, logout, getUserId } from '@/services/authService';

interface AuthContextType {
  isLoggedIn: boolean;
  userId: number | null;
  logout: () => void;
  setLoggedIn: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Kiểm tra đăng nhập khi component mount
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setIsLoggedIn(authStatus);
      setUserId(getUserId());
    };

    checkAuth();
    setIsInitialized(true);
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUserId(null);
  };

  const value = {
    isLoggedIn,
    userId,
    logout: handleLogout,
    setLoggedIn: setIsLoggedIn
  };

  return (
    <AuthContext.Provider value={value}>
      {isInitialized ? children : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 