import { pool } from '../config/db.js';
import { AttendanceSql } from '../models/attendance.model.js';
import { AttendanceEntity } from '../entities/attendance.entity.js';

/**
 * Repository xử lý mọi thao tác database cho Attendance
 */
export class AttendanceRepository {
    
    /**
     * Tìm tất cả bản ghi chấm công (có phân trang)
     */
    async findAll(options: {
        employeeId?: number;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    } = {}): Promise<{
        data: AttendanceEntity[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }> {
        const page = options.page || 1;
        const limit = options.limit || 10;
        const offset = (page - 1) * limit;
        
        // Get data
        const result = await pool.request()
            .input('employeeId', options.employeeId || null)
            .input('startDate', options.startDate || null)
            .input('endDate', options.endDate || null)
            .input('offset', offset)
            .input('limit', limit)
            .query(AttendanceSql.findAll);
        
        // Count total
        const countResult = await pool.request()
            .input('employeeId', options.employeeId || null)
            .input('startDate', options.startDate || null)
            .input('endDate', options.endDate || null)
            .query(`
                SELECT COUNT(*) as total
                FROM attendance
                WHERE (@employeeId IS NULL OR employee_id = @employeeId)
                  AND (@startDate IS NULL OR date >= @startDate)
                  AND (@endDate IS NULL OR date <= @endDate)
            `);
        
        const total = countResult.recordset[0].total;
        const totalPages = Math.ceil(total / limit);
        
        return {
            data: result.recordset.map((row: any) => new AttendanceEntity(row)),
            pagination: { page, limit, total, totalPages }
        };
    }
    
    /**
     * Tìm bản ghi theo ID
     */
    async findById(attendanceId: number): Promise<AttendanceEntity | null> {
        const result = await pool.request()
            .input('attendanceId', attendanceId)
            .query(AttendanceSql.findById);
        
        if (result.recordset.length === 0) return null;
        
        return new AttendanceEntity(result.recordset[0]);
    }
    
    /**
     * Tìm bản ghi chấm công của nhân viên trong ngày hôm nay
     */
    async findByEmployeeAndDate(
        employeeId: number,
        date: Date
    ): Promise<AttendanceEntity | null> {
        const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
        
        const result = await pool.request()
            .input('employeeId', employeeId)
            .input('date', dateString)
            .query(AttendanceSql.findByEmployeeAndDate);
        
        if (result.recordset.length === 0) return null;
        
        return new AttendanceEntity(result.recordset[0]);
    }
    
    /**
     * Lấy attendance hôm nay của user
     */
    async getTodayAttendance(userId: number): Promise<AttendanceEntity | null> {
        const today = new Date().toISOString().split('T')[0];
        
        const result = await pool.request()
            .input('employeeId', userId)
            .input('date', today)
            .query(AttendanceSql.findByEmployeeAndDate);
        
        if (result.recordset.length === 0) return null;
        
        return new AttendanceEntity(result.recordset[0]);
    }
    
    /**
     * Check-in
     */
    async checkInTime(
        userId: number,
        data: { location?: string; notes?: string }
    ): Promise<AttendanceEntity> {
        const today = new Date().toISOString().split('T')[0];
        const checkInTime = new Date().toISOString();
        
        // Check if late (after 8:30 AM)
        const now = new Date();
        const lateTime = new Date(now);
        lateTime.setHours(8, 30, 0, 0);
        const isLate = now > lateTime;
        
        const result = await pool.request()
            .input('employeeId', userId)
            .input('date', today)
            .input('checkIn', checkInTime)
            .input('isLate', isLate)
            .input('note', data.notes || null)
            .query(AttendanceSql.checkIn);
        
        return new AttendanceEntity(result.recordset[0]);
    }
    
    /**
     * Check-out
     */
    async checkOutTime(
        attendanceId: number,
        data: { location?: string; notes?: string }
    ): Promise<AttendanceEntity | null> {
        const checkOutTime = new Date().toISOString();
        
        // Check if early leave (before 5:30 PM)
        const now = new Date();
        const earlyTime = new Date(now);
        earlyTime.setHours(17, 30, 0, 0);
        const isEarlyLeave = now < earlyTime;
        
        const result = await pool.request()
            .input('attendanceId', attendanceId)
            .input('checkOut', checkOutTime)
            .input('isEarlyLeave', isEarlyLeave)
            .input('note', data.notes || null)
            .query(`
                UPDATE attendance
                SET 
                    check_out = @checkOut,
                    is_early_leave = @isEarlyLeave,
                    note = COALESCE(@note, note)
                OUTPUT 
                    inserted.attendance_id AS attendanceId,
                    inserted.employee_id AS employeeId,
                    inserted.date,
                    inserted.check_in AS checkIn,
                    inserted.check_out AS checkOut,
                    DATEDIFF(MINUTE, inserted.check_in, inserted.check_out) / 60.0 AS totalHours,
                    inserted.is_late AS isLate,
                    inserted.is_early_leave AS isEarlyLeave,
                    inserted.note
                WHERE attendance_id = @attendanceId
            `);
        
        if (result.recordset.length === 0) return null;
        
        return new AttendanceEntity(result.recordset[0]);
    }
    
    /**
     * Lấy lịch sử chấm công của user
     */
    async findByUserId(
        userId: number,
        options: {
            startDate?: string;
            endDate?: string;
            page?: number;
            limit?: number;
        } = {}
    ): Promise<{
        data: AttendanceEntity[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }> {
        const page = options.page || 1;
        const limit = options.limit || 10;
        const offset = (page - 1) * limit;
        
        const result = await pool.request()
            .input('employeeId', userId)
            .input('startDate', options.startDate || null)
            .input('endDate', options.endDate || null)
            .input('offset', offset)
            .input('limit', limit)
            .query(`
                SELECT 
                    attendance_id AS attendanceId,
                    employee_id AS employeeId,
                    date,
                    check_in AS checkIn,
                    check_out AS checkOut,
                    DATEDIFF(MINUTE, check_in, check_out) / 60.0 AS totalHours,
                    is_late AS isLate,
                    is_early_leave AS isEarlyLeave,
                    note
                FROM attendance
                WHERE employee_id = @employeeId
                  AND (@startDate IS NULL OR date >= @startDate)
                  AND (@endDate IS NULL OR date <= @endDate)
                ORDER BY date DESC
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY
            `);
        
        const countResult = await pool.request()
            .input('employeeId', userId)
            .input('startDate', options.startDate || null)
            .input('endDate', options.endDate || null)
            .query(`
                SELECT COUNT(*) as total
                FROM attendance
                WHERE employee_id = @employeeId
                  AND (@startDate IS NULL OR date >= @startDate)
                  AND (@endDate IS NULL OR date <= @endDate)
            `);
        
        const total = countResult.recordset[0].total;
        const totalPages = Math.ceil(total / limit);
        
        return {
            data: result.recordset.map((row: any) => new AttendanceEntity(row)),
            pagination: { page, limit, total, totalPages }
        };
    }
    
    /**
     * Tạo bản ghi thủ công (Admin)
     */
    async create(data: Partial<AttendanceEntity>): Promise<AttendanceEntity> {
        const result = await pool.request()
            .input('employeeId', data.employeeId)
            .input('date', data.date)
            .input('checkIn', data.checkIn || null)
            .input('checkOut', data.checkOut || null)
            .input('isLate', data.isLate || false)
            .input('isEarlyLeave', data.isEarlyLeave || false)
            .input('note', data.note || null)
            .query(AttendanceSql.create);
        
        return new AttendanceEntity(result.recordset[0]);
    }
    
    /**
     * Cập nhật bản ghi
     */
    async update(
        attendanceId: number,
        data: Partial<AttendanceEntity>
    ): Promise<AttendanceEntity | null> {
        const result = await pool.request()
            .input('attendanceId', attendanceId)
            .input('checkIn', data.checkIn || null)
            .input('checkOut', data.checkOut || null)
            .input('isLate', data.isLate ?? null)
            .input('isEarlyLeave', data.isEarlyLeave ?? null)
            .input('note', data.note || null)
            .query(AttendanceSql.update);
        
        if (result.recordset.length === 0) return null;
        
        return new AttendanceEntity(result.recordset[0]);
    }
    
    /**
     * Xóa bản ghi
     */
    async delete(attendanceId: number): Promise<boolean> {
        const result = await pool.request()
            .input('attendanceId', attendanceId)
            .query(AttendanceSql.delete);
        
        return result.rowsAffected[0] > 0;
    }
    
    /**
     * Lấy báo cáo tổng hợp chấm công
     */
    async getSummary(options: {
        employeeId?: number;
        startDate?: string;
        endDate?: string;
    } = {}): Promise<any> {
        const result = await pool.request()
            .input('employeeId', options.employeeId || null)
            .input('startDate', options.startDate || null)
            .input('endDate', options.endDate || null)
            .query(`
                SELECT 
                    employee_id AS employeeId,
                    COUNT(*) AS totalDays,
                    SUM(CASE WHEN check_in IS NOT NULL THEN 1 ELSE 0 END) AS checkedInDays,
                    SUM(CASE WHEN check_out IS NOT NULL THEN 1 ELSE 0 END) AS checkedOutDays,
                    SUM(CASE WHEN is_late = 1 THEN 1 ELSE 0 END) AS lateDays,
                    SUM(CASE WHEN is_early_leave = 1 THEN 1 ELSE 0 END) AS earlyLeaveDays,
                    AVG(DATEDIFF(MINUTE, check_in, check_out) / 60.0) AS avgWorkingHours
                FROM attendance
                WHERE (@employeeId IS NULL OR employee_id = @employeeId)
                  AND (@startDate IS NULL OR date >= @startDate)
                  AND (@endDate IS NULL OR date <= @endDate)
                GROUP BY employee_id
            `);
        
        return result.recordset;
    }
}