import axios from './axios.customize';
import type { IDepartment, CreateDepartmentRequest } from '../types';

export const departmentService = {
  getAllDepartments: async (includeDeleted: boolean = false): Promise<IDepartment[]> => {
    const response = await axios.get('/departments', {
      params: { includeDeleted, page: 1, limit: 1000 }
    });
    return response as any; 
  },
  
  getDepartmentById: async (id: string): Promise<IDepartment> => {
    const response = await axios.get(`/departments/${id}`);
    return response as any;
  },
  
  createDepartment: async (data: CreateDepartmentRequest): Promise<IDepartment> => {
    const response = await axios.post('/departments', data);
    return response as any;
  },
  
  updateDepartment: async (id: string, data: Partial<CreateDepartmentRequest>): Promise<IDepartment> => {
    const response = await axios.put(`/departments/${id}`, data);
    return response as any;
  },
  
  deleteDepartment: async (id: string): Promise<void> => {
    await axios.delete(`/departments/${id}`);
  },

  restoreDepartment: async (id: string): Promise<IDepartment> => {
    const response = await axios.patch(`/departments/${id}/restore`);
    return response as any;
  },
};