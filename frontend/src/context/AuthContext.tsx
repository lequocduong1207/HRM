import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, LoginRequest } from '../api/auth.api';
import { User } from '../types/rbac.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
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

  // Check token expiry periodically (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
        // Token expired, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/signin';
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    // Check if token is expired
    if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
      // Token expired, clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('user');
      setUser(null);
      setIsLoading(false);
      return;
    }

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData) as User;
        // Ensure permissions array exists
        if (!parsedUser.permissions) {
          parsedUser.permissions = [];
        }
        // Ensure role is set (backward compatibility)
        if (!parsedUser.role && parsedUser.roleName) {
          parsedUser.role = parsedUser.roleName;
        }
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const loginData: LoginRequest = { email, password };

      const response = await authAPI.login(loginData) as any;
      
      // Response structure: { success, data: { user, token, refreshToken, role }, message }
      const authData = response.data || response;

      // Extract user data with role info
      const userData: User = {
        ...authData.user,
        role: authData.user.role || authData.user.roleName || authData.role?.name, // Ensure role is set
        roleId: authData.user.roleId || authData.role?._id,
        roleName: authData.user.roleName || authData.role?.name,
        roleDisplayName: authData.user.roleDisplayName || authData.role?.displayName,
        permissions: authData.role?.permissions || authData.user.permissions || [],
      };

      // Save token, refreshToken and expiry time
      localStorage.setItem('token', authData.token);
      localStorage.setItem('refreshToken', authData.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Calculate and save token expiry time (7 days from now)
      const expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000);
      localStorage.setItem('tokenExpiry', expiryTime.toString());
      
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      isAdmin: (user?.roleName || user?.role) === 'admin',
      isLoading,
      permissions: user?.permissions || [],
      hasPermission,
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
