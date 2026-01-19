import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, LoginRequest } from '../api/auth.api';
import { User, RoleLevel } from '../types/rbac.types';

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

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData) as User;
        // Ensure permissions array exists
        if (!parsedUser.permissions) {
          parsedUser.permissions = [];
        }
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
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
        roleId: authData.user.roleId || authData.role?._id,
        roleName: authData.user.roleName || authData.role?.name,
        roleDisplayName: authData.user.roleDisplayName || authData.role?.displayName,
        permissions: authData.role?.permissions || authData.user.permissions || [],
      };

      // Check role hierarchy - Admin/HR Manager allowed
      const roleHierarchy: Record<string, RoleLevel> = {
        admin: RoleLevel.ADMIN,
        hr_manager: RoleLevel.HR_MANAGER,
        department_manager: RoleLevel.DEPARTMENT_MANAGER,
        employee: RoleLevel.EMPLOYEE,
      };

      const userLevel = roleHierarchy[userData.roleName || userData.role];
      
      // Only allow Admin and HR Manager to access admin panel
      if (userLevel === undefined || userLevel > RoleLevel.HR_MANAGER) { 
        throw new Error('Access denied. Admin or HR Manager only!');
      }

      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
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
