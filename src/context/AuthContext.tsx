'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isAuthenticated, logout, getUserId, getToken } from '@/services/authService';
import axios from 'axios';

// Interface cho thông tin người dùng
interface UserProfile {
  id: string;
  username: string;
  fullname: string;
  gender: string;
  email: string;
  createAt: string;
  updateAt: string;
  favoriteLists: any[];
}

interface AuthContextType {
  isLoggedIn: boolean;
  userId: number | null;
  userProfile: UserProfile | null;
  logout: () => void;
  setLoggedIn: (value: boolean) => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch user profile
  const fetchUserProfile = async () => {
    if (!isLoggedIn) return;
    
    try {
      const token = getToken();
      console.log('Fetching user profile with token:', token);
      
      const response = await axios.get('https://api.sonata.io.vn/api/v1/listener/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('User profile API response:', response.data);
      
      if (response.data && response.data.success) {
        setUserProfile(response.data.data);
        console.log('User profile set:', response.data.data);
      } else {
        console.error('Failed to get user profile:', response.data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    // Kiểm tra đăng nhập khi component mount
    const checkAuth = async () => {
      const authStatus = isAuthenticated();
      console.log('Auth status:', authStatus);
      
      setIsLoggedIn(authStatus);
      setUserId(getUserId());
      
      if (authStatus) {
        await fetchUserProfile();
      }
    };

    checkAuth();
    setIsInitialized(true);
  }, []);

  // Cập nhật profile mỗi khi đăng nhập thay đổi
  useEffect(() => {
    console.log('isLoggedIn changed:', isLoggedIn);
    if (isLoggedIn) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUserId(null);
    setUserProfile(null);
  };

  const value = {
    isLoggedIn,
    userId,
    userProfile,
    logout: handleLogout,
    setLoggedIn: setIsLoggedIn,
    refreshUserProfile: fetchUserProfile
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