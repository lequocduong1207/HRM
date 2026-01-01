import axios from './axios.customize.ts';

export interface Department {
    departmentId: number;
    name: string;
    description: string | null;
    managerId: number | null;
    managerName: string | null;  
    employeeCount: number;        
    createdAt: Date;
    updatedAt: Date;
}

export const departmentService = {
  getAllDepartments: async () => axios.get(`/departments`).then(res => res.data),
  getDepartmentById: async (id: number) => axios.get(`/departments/${id}`).then(res => res.data),
  createDepartment: async (data: Partial<Department>) => axios.post(`/departments`, data).then(res => res.data),
  updateDepartment: async (id: number, data: Partial<Department>) => axios.put(`/departments/${id}`, data).then(res => res.data),
  deleteDepartment: async (id: number) => axios.delete(`/departments/${id}`).then(res => res.data),
};