export const AttendanceSql = {
    /**
     * Tìm tất cả bản ghi chấm công
     * Hỗ trợ phân trang và lọc theo employeeId, date range
     */
    findAll: `
        SELECT 
            attendance_id AS attendanceId,
            employee_id AS employeeId,
            date,
            check_in AS checkIn,
            check_out AS checkOut,
            DATEDIFF(MINUTE, check_in, check_out) / 60.0 AS totalHours,
            is_late AS isLate,
            is_early_leave AS isEarlyLeave,
            note,
            created_at AS createdAt
        FROM attendance
        WHERE (@employeeId IS NULL OR employee_id = @employeeId)
          AND (@startDate IS NULL OR date >= @startDate)
          AND (@endDate IS NULL OR date <= @endDate)
        ORDER BY date DESC, created_at DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
    `,
    
    /**
     * Tìm bản ghi chấm công theo ID
     */
    findById: `
        SELECT 
            attendance_id AS attendanceId,
            employee_id AS employeeId,
            date,
            check_in AS checkIn,
            check_out AS checkOut,
            DATEDIFF(MINUTE, check_in, check_out) / 60.0 AS totalHours,
            is_late AS isLate,
            is_early_leave AS isEarlyLeave,
            note,
            created_at AS createdAt
        FROM attendance
        WHERE attendance_id = @attendanceId
    `,
    
    /**
     * Tìm bản ghi chấm công của một nhân viên trong một ngày cụ thể
     */
    findByEmployeeAndDate: `
        SELECT 
            attendance_id AS attendanceId,
            employee_id AS employeeId,
            date,
            check_in AS checkIn,
            check_out AS checkOut,
            DATEDIFF(MINUTE, check_in, check_out) / 60.0 AS totalHours,
            is_late AS isLate,
            is_early_leave AS isEarlyLeave,
            note,
            created_at AS createdAt
        FROM attendance
        WHERE employee_id = @employeeId 
          AND CAST(date AS DATE) = @date
    `,
    
    /**
     * Check-in: Tạo bản ghi mới hoặc cập nhật giờ vào
     */
    checkIn: `
        MERGE INTO attendance AS target
        USING (
            SELECT @employeeId AS employeeId, @date AS date
        ) AS source
        ON target.employee_id = source.employeeId 
           AND CAST(target.date AS DATE) = source.date
        WHEN MATCHED AND target.check_in IS NULL THEN
            UPDATE SET 
                check_in = @checkIn,
                is_late = @isLate,
                note = COALESCE(@note, target.note)
        WHEN NOT MATCHED THEN
            INSERT (employee_id, date, check_in, is_late, note)
            VALUES (@employeeId, @date, @checkIn, @isLate, @note)
        OUTPUT 
            inserted.attendance_id AS attendanceId,
            inserted.employee_id AS employeeId,
            inserted.date,
            inserted.check_in AS checkIn,
            inserted.check_out AS checkOut,
            inserted.is_late AS isLate,
            inserted.note,
            inserted.created_at AS createdAt;
    `,
    
    /**
     * Check-out: Cập nhật giờ ra
     */
    checkOut: `
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
            inserted.note,
            inserted.created_at AS createdAt
        WHERE employee_id = @employeeId 
          AND CAST(date AS DATE) = @date
          AND check_out IS NULL
    `,
    
    /**
     * Tạo bản ghi chấm công thủ công (cho Admin)
     */
    create: `
        INSERT INTO attendance (
            employee_id, date, check_in, check_out, 
            is_late, is_early_leave, note
        )
        OUTPUT 
            inserted.attendance_id AS attendanceId,
            inserted.employee_id AS employeeId,
            inserted.date,
            inserted.check_in AS checkIn,
            inserted.check_out AS checkOut,
            DATEDIFF(MINUTE, inserted.check_in, inserted.check_out) / 60.0 AS totalHours,
            inserted.is_late AS isLate,
            inserted.is_early_leave AS isEarlyLeave,
            inserted.note,
            inserted.created_at AS createdAt
        VALUES (
            @employeeId, @date, @checkIn, @checkOut, 
            @isLate, @isEarlyLeave, @note
        )
    `,
    
    /**
     * Cập nhật bản ghi (sửa lỗi - cho Admin)
     */
    update: `
        UPDATE attendance
        SET 
            check_in = COALESCE(@checkIn, check_in),
            check_out = COALESCE(@checkOut, check_out),
            is_late = COALESCE(@isLate, is_late),
            is_early_leave = COALESCE(@isEarlyLeave, is_early_leave),
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
            inserted.note,
            inserted.created_at AS createdAt
        WHERE attendance_id = @attendanceId
    `,
    
    /**
     * Xóa bản ghi
     */
    delete: `
        DELETE FROM attendance
        WHERE attendance_id = @attendanceId
    `,
    
    /**
     * Lấy lịch sử chấm công của một nhân viên
     */
    getHistoryByEmployee: `
        SELECT 
            attendance_id AS attendanceId,
            employee_id AS employeeId,
            date,
            check_in AS checkIn,
            check_out AS checkOut,
            DATEDIFF(MINUTE, check_in, check_out) / 60.0 AS totalHours,
            is_late AS isLate,
            is_early_leave AS isEarlyLeave,
            note,
            created_at AS createdAt
        FROM attendance
        WHERE employee_id = @employeeId
          AND (@startDate IS NULL OR date >= @startDate)
          AND (@endDate IS NULL OR date <= @endDate)
        ORDER BY date DESC
    `
};