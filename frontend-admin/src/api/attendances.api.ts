import axios from './axios.customize.ts';

export interface Attendance {
    attendanceId: number;          
    employeeId: number;            
    date: Date;                    
    checkIn: string | null;        
    checkOut: string | null;      
    totalHours: number | null;     
    isLate: boolean;               
    isEarlyLeave: boolean;         
    note: string | null;           
    createdAt: Date;     
}

export const attendanceService = {
  getAllAttendance: async () => axios.get(`/attendances`).then(res => res.data),
  getAttendanceByEmployee: async (employeeId: number) => axios.get(`/attendances/employee/${employeeId}`).then(res => res.data),
  createAttendance: async (data: Partial<Attendance>) => axios.post(`/attendances`, data).then(res => res.data),
  updateAttendance: async (id: number, data: Partial<Attendance>) => axios.put(`/attendances/${id}`, data).then(res => res.data),
  deleteAttendance: async (id: number) => axios.delete(`/attendances/${id}`).then(res => res.data),
};