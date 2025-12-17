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
    async checkIn(userId: number, data: { location?: string; notes?: string }) {
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
    async checkOut(userId: number, data: { location?: string; notes?: string }) {
        // Kiểm tra đã check-in chưa
        const today = await this.attendanceRepository.getTodayAttendance(userId);
        if (!today || !today.checkIn) {
            throw new AppError('You need to check in first', 400);
        }

        if (today.checkOut) {
            throw new AppError('You have already checked out today', 400);
        }

        const attendance = await this.attendanceRepository.checkOutTime(today.attendanceId!, data);
        return attendance;
    }

    /**
     * Lấy lịch sử chấm công của user
     */
    async getMyAttendances(userId: number, options: any) {
        return await this.attendanceRepository.findByUserId(userId, options);
    }

    /**
     * Kiểm tra trạng thái chấm công hôm nay
     */
    async getTodayAttendance(userId: number) {
        return await this.attendanceRepository.getTodayAttendance(userId);
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
