import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../services/authService';

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
    const response = await authService.login(email, password);
    localStorage.setItem("token", response.token);
    setIsLoggedIn(true);
    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    isLoading,
    login,
    logout,
    checkAuthStatus
  };
}