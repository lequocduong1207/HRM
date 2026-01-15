import axios from './axios.customize';
import type { IAttendance, CheckInRequest, CheckOutRequest, AttendanceFilterParams } from '../types';

export const attendanceService = {
  getAllAttendances: async (params?: AttendanceFilterParams): Promise<IAttendance[]> => {
    const response = await axios.get('/attendance', { params });
    return response.data;
  },
  
  getAttendanceById: async (id: string): Promise<IAttendance> => {
    const response = await axios.get(`/attendance/${id}`);
    return response.data;
  },
  
  checkIn: async (data: CheckInRequest): Promise<IAttendance> => {
    const response = await axios.post('/attendance/check-in', data);
    return response.data;
  },
  
  checkOut: async (data: CheckOutRequest): Promise<IAttendance> => {
    const response = await axios.post('/attendance/check-out', data);
    return response.data;
  },
  
  getEmployeeAttendance: async (employeeId: string, params?: AttendanceFilterParams): Promise<IAttendance[]> => {
    const response = await axios.get(`/attendance/employee/${employeeId}`, { params });
    return response.data;
  },
};
