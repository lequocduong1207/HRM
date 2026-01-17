import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, LoginRequest } from '../api/auth.api';

interface User {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'hr_manager' | 'manager' | 'employee';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const loginData: LoginRequest = { email, password };

      const response = await authAPI.login(loginData) as any;
      
      // Response structure: { success, data: { user, token, refreshToken }, message }
      const loginData2 = response.data || response;

      // Kiểm tra role - CHỈ ADMIN MỚI ĐƯỢC VÀO
      if (loginData2.user.role !== 'admin') { 
        throw new Error('Access denied. Admin only!');
      }

      localStorage.setItem('token', loginData2.token);
      localStorage.setItem('user', JSON.stringify(loginData2.user));
      
      setUser(loginData2.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isLoading,
      login, 
      logout,
      checkAuth 
    }}>
      {children}
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