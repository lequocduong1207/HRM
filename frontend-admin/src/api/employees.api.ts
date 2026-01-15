import axios from './axios.customize';
import type { IEmployee, CreateEmployeeRequest } from '../types';

export const employeeService = {
  getAllEmployees: async (): Promise<IEmployee[]> => {
    const response = await axios.get('/employees');
    return response.data;
  },
  
  getEmployeeById: async (id: string): Promise<IEmployee> => {
    const response = await axios.get(`/employees/${id}`);
    return response.data;
  },
  
  createEmployee: async (data: CreateEmployeeRequest): Promise<IEmployee> => {
    const response = await axios.post('/employees', data);
    return response.data;
  },
  
  updateEmployee: async (id: string, data: Partial<CreateEmployeeRequest>): Promise<IEmployee> => {
    const response = await axios.put(`/employees/${id}`, data);
    return response.data;
  },
  
  deleteEmployee: async (id: string): Promise<void> => {
    await axios.delete(`/employees/${id}`);
  },
  
  activateEmployee: async (id: string): Promise<void> => {
    await axios.patch(`/employees/${id}/activate`);
  },
  
  deactivateEmployee: async (id: string): Promise<void> => {
    await axios.patch(`/employees/${id}/deactivate`);
  },
  
  getEmployeesByDepartment: async (departmentId: string): Promise<IEmployee[]> => {
    const response = await axios.get(`/employees/department/${departmentId}`);
    console.log('Employees in department:', response.data);
    return response.data.data;
  },
};