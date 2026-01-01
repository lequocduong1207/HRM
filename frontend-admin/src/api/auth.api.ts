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
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return await axios.post('/auth/login', data);
  },

  getCurrentUser: async () => {
    return await axios.get('/auth/me');
  },

  logout: async () => {
    return await axios.post('/auth/logout');
  },
};