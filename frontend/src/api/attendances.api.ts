import axios from './axios.customize';
import type { IAttendance, CheckInRequest, CheckOutRequest, AttendanceFilterParams } from '../types';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const attendanceService = {
  // Admin: Get all attendances (có thể truyền params để filter hoặc bỏ qua để lấy tất cả)
  getAllAttendances: async (params?: AttendanceFilterParams): Promise<IAttendance[]> => {
    const response = await axios.get<ApiResponse<IAttendance[]>>('/attendances', { params });
    return response as any;
  },
  
  // Get attendance by ID
  getAttendanceById: async (id: string | number): Promise<IAttendance> => {
    const response = await axios.get<ApiResponse<IAttendance>>(`/attendances/${id}`);
    return response as any;
  },
  
  // User: Check in
  checkIn: async (data: CheckInRequest): Promise<IAttendance> => {
    const response = await axios.post<ApiResponse<IAttendance>>('/attendances/check-in', data);
    return response as any;
  },
  
  // User: Check out
  checkOut: async (data: CheckOutRequest): Promise<IAttendance> => {
    const response = await axios.put<ApiResponse<IAttendance>>('/attendances/check-out', data);
    return response as any;
  },
  
  // User: Get my attendances
  getMyAttendances: async (params?: AttendanceFilterParams): Promise<IAttendance[]> => {
    const response = await axios.get<ApiResponse<IAttendance[]>>('/attendances/my-attendances', { params });
    return response as any;
  },

  // User: Get today attendance
  getTodayAttendance: async (): Promise<IAttendance | null> => {
    const response = await axios.get<ApiResponse<IAttendance | null>>('/attendances/today');
    return response as any;
  },

  // Admin: Update attendance
  updateAttendance: async (id: string | number, data: Partial<IAttendance>): Promise<IAttendance> => {
    const response = await axios.put<ApiResponse<IAttendance>>(`/attendances/${id}`, data);
    return response as any;
  },

  // Admin: Delete attendance
  deleteAttendance: async (id: string | number): Promise<void> => {
    await axios.delete(`/attendances/${id}`);
  },

  // Admin: Get attendance summary
  getAttendanceSummary: async (params?: AttendanceFilterParams): Promise<any> => {
    const response = await axios.get<ApiResponse<any>>('/attendances/report/summary', { params });
    return response as any;
  },

  // Admin: Get attendance history for specific employee
  getAttendanceHistory: async (params: AttendanceFilterParams): Promise<IAttendance[]> => {
    const response = await axios.get<ApiResponse<IAttendance[]>>('/attendances', { params });
    return response as any;
  },
};
