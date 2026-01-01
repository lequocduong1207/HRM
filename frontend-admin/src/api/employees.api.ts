import axios from './axios.customize.ts';

export interface Employee {
    employeeId: string;
    fullName: string;
    dob: Date | null;
    gender: "Male" | "Female" | "Other" | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    nationalId: string | null;         
    departmentId: number | null;
    position: string | null;
    hireDate: Date | null;
    employmentStatus: 'active' | 'inactive' | 'terminated' | 'resigned';
    createdAt: Date;
    updatedAt: Date;
}

export const employeeService = {
  getAllEmployees: async () => axios.get(`/employees`).then(res => res.data),
  getEmployeeById: async (id: number) => axios.get(`/employees/${id}`).then(res => res.data),
  createEmployee: async (data: Partial<Employee>) => axios.post(`/employees`, data).then(res => res.data),
  updateEmployee: async (id: number, data: Partial<Employee>) => axios.put(`/employees/${id}`, data).then(res => res.data),
  deleteEmployee: async (id: number) => axios.delete(`/employees/${id}`).then(res => res.data),
};