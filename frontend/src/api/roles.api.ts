import axiosInstance from './axios.customize';
import type { ApiResponse } from '../types';
import type { IRole } from '../types/role.types';

export const roleService = {
  getAllRoles: async (params?: { includeInactive?: boolean; includeSystemRoles?: boolean }) => {
    const response = await axiosInstance.get<ApiResponse<IRole[]>>('/roles', { params });
    return response.data;
  },

  getRoleById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<IRole>>(`/roles/${id}`);
    return response.data;
  },

  getRoleByName: async (name: string) => {
    const response = await axiosInstance.get<ApiResponse<IRole>>(`/roles/name/${name}`);
    return response.data;
  },

  createRole: async (data: Partial<IRole>) => {
    const response = await axiosInstance.post<ApiResponse<IRole>>('/roles', data);
    return response.data;
  },

  updateRole: async (id: string, data: Partial<IRole>) => {
    const response = await axiosInstance.put<ApiResponse<IRole>>(`/roles/${id}`, data);
    return response.data;
  },

  deleteRole: async (id: string, hard = false) => {
    const response = await axiosInstance.delete<ApiResponse>(`/roles/${id}`, {
      params: { hard },
    });
    return response.data;
  },

  assignPermissions: async (id: string, permissions: string[]) => {
    const response = await axiosInstance.post<ApiResponse<IRole>>(`/roles/${id}/permissions`, {
      permissions,
    });
    return response.data;
  },

  removePermissions: async (id: string, permissions: string[]) => {
    const response = await axiosInstance.delete<ApiResponse<IRole>>(`/roles/${id}/permissions`, {
      data: { permissions },
    });
    return response.data;
  },
};
