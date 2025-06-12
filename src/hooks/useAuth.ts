import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../services/authService';
import { handleApiError } from '../utils/errorHandler';
import toast from 'react-hot-toast';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: unknown = jwtDecode(token);
        const isTokenValid = (decoded as { exp: number }).exp * 1000 > Date.now();

        if (!isTokenValid) {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      localStorage.setItem("token", response.token);
      setIsLoggedIn(true);
      toast.success('Welcome back!');
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success('Logged out successfully');
  };

  const handleSessionExpired = () => {
    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    isLoading,
    login,
    logout,
    checkAuthStatus,
    handleSessionExpired
  };
}