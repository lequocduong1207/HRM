import axios from './axios.customize';
import { AuthData } from '../types/rbac.types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
}

export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axios.post('/auth/login', data);
    return response as any;
  },

  getCurrentUser: async () => {
    const response = await axios.get('/auth/me');
    return response as any;
  },

  logout: async () => {
    const response = await axios.post('/auth/logout');
    return response as any;
  },

  getProfile: async () => {
    const response = await axios.get('/auth/profile');
    return response as any;
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await axios.post('/auth/refresh-token', { refreshToken });
    return response as any;
  }
};