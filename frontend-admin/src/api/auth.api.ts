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
    const response = await axios.post('/auth/login', data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axios.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await axios.post('/auth/logout');
    return response.data;
  },
};