import axios from './axios.customize';
import type { IDepartment, CreateDepartmentRequest } from '../types';

export const departmentService = {
  getAllDepartments: async (): Promise<IDepartment[]> => {
    const response = await axios.get('/departments');
    return response.data; 
  },
  
  getDepartmentById: async (id: string): Promise<IDepartment> => {
    const response = await axios.get(`/departments/${id}`);
    return response.data;
  },
  
  createDepartment: async (data: CreateDepartmentRequest): Promise<IDepartment> => {
    const response = await axios.post('/departments', data);
    return response.data;
  },
  
  updateDepartment: async (id: string, data: Partial<CreateDepartmentRequest>): Promise<IDepartment> => {
    const response = await axios.put(`/departments/${id}`, data);
    return response.data;
  },
  
  deleteDepartment: async (id: string): Promise<void> => {
    await axios.delete(`/departments/${id}`);
  },

  restoreDepartment: async (id: string): Promise<IDepartment> => {
    const response = await axios.patch(`/departments/${id}/restore`);
    return response.data;
  },
};