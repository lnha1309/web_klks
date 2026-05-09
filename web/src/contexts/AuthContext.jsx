import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success) {
            setCurrentUser(res.user);
          }
        } catch (error) {
          console.error("Lỗi lấy thông tin user:", error);
          localStorage.removeItem('token');
        }
      }
      setInitialLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      if (res.success) {
        localStorage.setItem('token', res.token);
        setCurrentUser(res.user);
        return { success: true };
      }
      return { success: false, error: res.message || "Đăng nhập thất bại" };
    } catch (error) {
      return { success: false, error: error.message || "Đã có lỗi xảy ra" };
    }
  };

  const signup = async (fullName, email, password) => {
    try {
      const res = await authService.register(fullName, email, password);
      if (res.success) {
        localStorage.setItem('token', res.token);
        setCurrentUser(res.user);
        return { success: true };
      }
      return { success: false, error: res.message || "Đăng ký thất bại" };
    } catch (error) {
      return { success: false, error: error.message || "Đã có lỗi xảy ra" };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/');
  };

  const value = {
    currentUser,
    login,
    logout,
    signup,
    isAuthenticated: !!currentUser
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};