import axios from './axios.customize';
import type { IUser, CreateUserRequest } from '../types';

export const userService = {
  getAllUsers: async (): Promise<IUser[]> => {
    const response = await axios.get('/users');
    return response as any;
  },
  
  getUserById: async (id: string): Promise<IUser> => {
    const response = await axios.get(`/users/${id}`);
    return response as any;
  },
  
  createUser: async (data: CreateUserRequest): Promise<IUser> => {
    const response = await axios.post('/users', data);
    return response as any;
  },
  
  updateUser: async (id: string, data: Partial<CreateUserRequest>): Promise<IUser> => {
    const response = await axios.put(`/users/${id}`, data);
    return response as any;
  },
  
  deleteUser: async (id: string): Promise<void> => {
    await axios.delete(`/users/${id}`);
  },
  
  activateUser: async (id: string): Promise<IUser> => {
    const response = await axios.patch(`/users/${id}/activate`);
    return response as any;
  },
  
  deactivateUser: async (id: string): Promise<IUser> => {
    const response = await axios.patch(`/users/${id}/deactivate`);
    return response as any;
  },
  
  changePassword: async (id: string, newPassword: string): Promise<void> => {
    await axios.patch(`/users/${id}/change-password`, { newPassword });
  },
};
