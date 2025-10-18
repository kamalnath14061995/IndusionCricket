import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  experienceLevel: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'role'> & { password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<boolean>;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null); // stores access token for headers

  const inactivityTimeoutRef = useRef<number | null>(null);
  const activityEventsRef = useRef<string[]>(['mousedown', 'keydown', 'scroll', 'touchstart']);
  const INACTIVITY_TIMEOUT = 20 * 60 * 1000; // 20 minutes in milliseconds

  const resetInactivityTimer = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    inactivityTimeoutRef.current = window.setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT);
  };

  const handleActivity = () => {
    if (isAuthenticated) {
      resetInactivityTimer();
    }
  };

  const startInactivityTimer = () => {
    resetInactivityTimer();
    activityEventsRef.current.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });
  };

  const stopInactivityTimer = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = null;
    }
    activityEventsRef.current.forEach(event => {
      document.removeEventListener(event, handleActivity, true);
    });
  };

  useEffect(() => {
    // Restore session
    const storedUser = localStorage.getItem('user');
    const storedAccess = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (storedUser && storedAccess) {
      setUser(JSON.parse(storedUser));
      setToken(storedAccess);
      setIsAuthenticated(true);
      // Start inactivity timer for restored session
      startInactivityTimer();
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const user: User = {
          id: data.data.id,
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone,
          age: data.data.age,
          experienceLevel: data.data.experienceLevel,
          role: data.data.role?.toLowerCase() === 'admin' ? 'admin' : 'user',
        };
        // Prefer new access/refresh tokens; fallback to legacy token
        const accessToken: string = data.data.accessToken || data.data.token;
        const refreshToken: string | null = data.data.refreshToken || null;

        setUser(user);
        setToken(accessToken);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('token', accessToken); // backward compatibility
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        // Start inactivity timer
        startInactivityTimer();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id' | 'role'> & { password: string }): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          age: userData.age,
          experienceLevel: userData.experienceLevel,
          password: userData.password,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const newUser: User = {
          id: data.data.id,
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone,
          age: data.data.age,
          experienceLevel: data.data.experienceLevel,
          role: data.data.role?.toLowerCase() === 'admin' ? 'admin' : 'user',
        };
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(newUser));
        // Start inactivity timer
        startInactivityTimer();
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error: any) {
      return { success: false, message: error?.message || 'Network error' };
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      if (token) {
        await fetch('http://localhost:8080/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
      // Stop inactivity timer
      stopInactivityTimer();
      // Clear local state and storage
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return true;
    } catch (error) {
      // Clear local state even if there's an error
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return false;
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stopInactivityTimer();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, token }}>
      {children}
    </AuthContext.Provider>
  );
};
