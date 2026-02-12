import axios from './axios.customize';
import type { ILeaveRequest, ApiResponse, PaginatedResponse } from '../types';

export interface CreateLeaveRequest {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface UpdateLeaveRequest {
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
}

export interface ApproveRejectLeaveRequest {
  status: 'Approved' | 'Rejected';
  rejectionReason?: string;
}

export interface LeaveFilterParams {
  status?: string;
  leaveType?: string;
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface LeaveStatistics {
  leaveType: string;
  count: number;
  totalDays: number;
}

export const leaveService = {
  // Employee APIs
  createLeave: async (data: CreateLeaveRequest): Promise<ApiResponse<ILeaveRequest>> => {
    const response = await axios.post('/leaves', data);
    return response as any;
  },

  getMyLeaves: async (params?: LeaveFilterParams): Promise<ApiResponse<ILeaveRequest[]>> => {
    const response = await axios.get('/leaves/my-leaves', { params });
    return response as any;
  },

  getLeaveById: async (id: string): Promise<ApiResponse<ILeaveRequest>> => {
    const response = await axios.get(`/leaves/${id}`);
    return response as any;
  },

  updateLeave: async (id: string, data: UpdateLeaveRequest): Promise<ApiResponse<ILeaveRequest>> => {
    const response = await axios.put(`/leaves/${id}`, data);
    return response as any;
  },

  cancelLeave: async (id: string): Promise<ApiResponse<ILeaveRequest>> => {
    const response = await axios.put(`/leaves/${id}/cancel`);
    return response as any;
  },

  getUsedLeaveDays: async (year?: number): Promise<ApiResponse<{ year: number; usedDays: number }>> => {
    const response = await axios.get('/leaves/my-leaves/used-days', { 
      params: { year } 
    });
    return response as any;
  },

  // Admin APIs
  getAllLeaves: async (params?: LeaveFilterParams): Promise<PaginatedResponse<ILeaveRequest>> => {
    const response = await axios.get('/leaves/admin/all', { params });
    return response as any;
  },

  approveOrRejectLeave: async (
    id: string, 
    data: ApproveRejectLeaveRequest
  ): Promise<ApiResponse<ILeaveRequest>> => {
    const response = await axios.put(`/leaves/admin/${id}/approve`, data);
    return response as any;
  },

  deleteLeave: async (id: string): Promise<ApiResponse> => {
    const response = await axios.delete(`/leaves/admin/${id}`);
    return response as any;
  },

  getLeaveStatistics: async (params?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<ApiResponse<LeaveStatistics[]>> => {
    const response = await axios.get('/leaves/admin/statistics', { params });
    return response as any;
  },
};
