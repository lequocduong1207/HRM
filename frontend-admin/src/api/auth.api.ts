import axios from './axios.customize';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      userId: number;
      username: string;
      email: string;
      fullName: string;
      role: 'admin' | 'hr_manager' | 'manager' | 'employee';
    };
    token: string;
    refreshToken: string;
  };
}

export const authAPI = {
  // Login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return await axios.post('/auth/login', data);
  },

  // Get current user
  getCurrentUser: async () => {
    return await axios.get('/auth/me');
  },

  // Logout
  logout: async () => {
    return await axios.post('/auth/logout');
  },
};