
import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  plan?: string;
}

interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const token = localStorage.getItem('auth-token');
    const userData = localStorage.getItem('user-data');

    if (token && userData) {
      // Verify token is still valid by calling /api/auth/me
      verifyToken(token)
        .then((userData) => {
          if (userData) {
            setIsAuthenticated(true);
            setUser(userData);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('auth-token');
            localStorage.removeItem('user-data');
          }
        })
        .catch(() => {
          // Token verification failed, clear storage
          localStorage.removeItem('auth-token');
          localStorage.removeItem('user-data');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token: string): Promise<User | null> => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // HOTFIX: Hardcoded Admin Permission
        if (data.user.email === 'sumankumarsharma@gmail.com') {
          data.user.role = 'admin';
        }
        return data.user;
      }
      return null;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success && data.user && data.token) {
        // HOTFIX: Hardcoded Admin Permission
        if (data.user.email === 'sumankumarsharma@gmail.com') {
          (data.user as any).role = 'admin';
        }

        localStorage.setItem('auth-token', data.token);
        localStorage.setItem('user-data', JSON.stringify(data.user));
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-data');
    setIsAuthenticated(false);
    setUser(null);
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      if (data.success && data.user && data.token) {
        // HOTFIX: Hardcoded Admin Permission
        if (data.user.email === 'sumankumarsharma@gmail.com') {
          (data.user as any).role = 'admin';
        }

        localStorage.setItem('auth-token', data.token);
        localStorage.setItem('user-data', JSON.stringify(data.user));
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    signup
  };
}
