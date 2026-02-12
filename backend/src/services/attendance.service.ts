import { AttendanceRepository } from '../repositories/attendance.repository.js';
import { AppError } from '../middlewares/error/error-handler.middleware.js';

export class AttendanceService {
    private attendanceRepository: AttendanceRepository;

    constructor() {
        this.attendanceRepository = new AttendanceRepository();
    }

    /**
     * Check in
     */
    async checkIn(userId: string, data: { location?: string; notes?: string }) {
        // Kiểm tra đã check-in hôm nay chưa
        const today = await this.attendanceRepository.getTodayAttendance(userId);
        if (today && today.checkIn) {
            throw new AppError('You have already checked in today', 400);
        }

        const attendance = await this.attendanceRepository.checkInTime(userId, data);
        return attendance;
    }

    /**
     * Check out
     */
    async checkOut(userId: string, data: { location?: string; notes?: string }) {
        // Kiểm tra đã check-in chưa
        const today = await this.attendanceRepository.getTodayAttendance(userId);
        if (!today || !today.checkIn) {
            throw new AppError('You need to check in first', 400);
        }

        if (today.checkOut) {
            throw new AppError('You have already checked out today', 400);
        }

        const attendance = await this.attendanceRepository.checkOutTime(today._id.toString(), data);
        return attendance;
    }

    /**
     * Lấy lịch sử chấm công của user
     */
    async getMyAttendances(userId: string, options: any) {
        return await this.attendanceRepository.findByUserId(userId, options);
    }

    /**
     * Kiểm tra trạng thái chấm công hôm nay
     */
    async getTodayAttendance(userId: string) {
        return await this.attendanceRepository.getTodayAttendance(userId);
    }

    /**
     * Lấy thống kê chấm công của user
     */
    async getMyStats(userId: string, options: { startDate?: string; endDate?: string }) {
        // Set default date range to current month if not provided
        const now = new Date();
        const startDate = options.startDate || new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const endDate = options.endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

        // Get attendance records for the period
        const attendances = await this.attendanceRepository.findByUserId(userId, {
            startDate,
            endDate,
            limit: 1000 // Get all records for the period
        });

        // Calculate statistics
        const totalDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const presentDays = attendances.filter((a: any) => a.status === 'present').length;
        const lateDays = attendances.filter((a: any) => a.isLate).length;
        const absentDays = attendances.filter((a: any) => a.status === 'absent').length;
        const totalWorkHours = attendances.reduce((sum: number, a: any) => sum + (a.workHours || 0), 0);

        return {
            totalDays,
            presentDays,
            lateDays,
            absentDays,
            totalWorkHours
        };
    }

    /**
     * Lấy tất cả attendances (Admin)
     */
    async getAllAttendances(options: any) {
        return await this.attendanceRepository.findAll(options);
    }

    /**
     * Lấy chi tiết attendance
     */
    async getAttendanceById(attendanceId: number) {
        const attendance = await this.attendanceRepository.findById(attendanceId);
        if (!attendance) {
            throw new AppError('Attendance not found', 404);
        }
        return attendance;
    }

    /**
     * Cập nhật attendance (Admin)
     */
    async updateAttendance(attendanceId: number, data: any) {
        const attendance = await this.attendanceRepository.findById(attendanceId);
        if (!attendance) {
            throw new AppError('Attendance not found', 404);
        }

        return await this.attendanceRepository.update(attendanceId, data);
    }

    /**
     * Xóa attendance (Admin)
     */
    async deleteAttendance(attendanceId: number) {
        const attendance = await this.attendanceRepository.findById(attendanceId);
        if (!attendance) {
            throw new AppError('Attendance not found', 404);
        }

        return await this.attendanceRepository.delete(attendanceId);
    }

    /**
     * Báo cáo tổng hợp chấm công
     */
    async getAttendanceSummary(options: any) {
        return await this.attendanceRepository.getSummary(options);
    }
}
