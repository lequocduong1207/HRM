export const EmployeeSql = {
    /**
     * Tìm tất cả nhân viên
     * Hỗ trợ phân trang, tìm kiếm, và lọc theo phòng ban/trạng thái
     */
    findAll: `
        SELECT 
            e.employee_id AS employeeId,
            e.full_name AS fullName,
            e.dob,
            e.gender,
            e.email,
            e.phone,
            e.address,
            e.national_id AS nationalId,
            e.department_id AS departmentId,
            d.name AS departmentName,
            e.position,
            e.hire_date AS hireDate,
            e.employment_status AS employmentStatus,
            e.created_at AS createdAt,
            e.updated_at AS updatedAt
        FROM employee e
        LEFT JOIN department d ON e.department_id = d.department_id
        WHERE 
            (@searchTerm IS NULL OR 
                e.full_name LIKE '%' + @searchTerm + '%' OR
                e.email LIKE '%' + @searchTerm + '%' OR
                e.phone LIKE '%' + @searchTerm + '%')
            AND (@departmentId IS NULL OR e.department_id = @departmentId)
            AND (@employmentStatus IS NULL OR e.employment_status = @employmentStatus)
        ORDER BY e.created_at DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
    `,

    /**
     * Đếm tổng số nhân viên (cho phân trang)
     */
    count: `
        SELECT COUNT(*) AS total
        FROM employee e
        WHERE 
            (@searchTerm IS NULL OR 
                e.full_name LIKE '%' + @searchTerm + '%' OR
                e.email LIKE '%' + @searchTerm + '%' OR
                e.phone LIKE '%' + @searchTerm + '%')
            AND (@departmentId IS NULL OR e.department_id = @departmentId)
            AND (@employmentStatus IS NULL OR e.employment_status = @employmentStatus)
    `,

    /**
     * Tìm nhân viên theo ID
     */
    findById: `
        SELECT 
            e.employee_id AS employeeId,
            e.full_name AS fullName,
            e.dob,
            e.gender,
            e.email,
            e.phone,
            e.address,
            e.national_id AS nationalId,
            e.department_id AS departmentId,
            d.name AS departmentName,
            d.description AS departmentDescription,
            e.position,
            e.hire_date AS hireDate,
            e.employment_status AS employmentStatus,
            e.created_at AS createdAt,
            e.updated_at AS updatedAt
        FROM employee e
        LEFT JOIN department d ON e.department_id = d.department_id
        WHERE e.employee_id = @employeeId
    `,

    /**
     * Tìm nhân viên theo email (dùng cho đăng nhập, kiểm tra trùng)
     */
    findByEmail: `
        SELECT 
            e.employee_id AS employeeId,
            e.full_name AS fullName,
            e.dob,
            e.gender,
            e.email,
            e.phone,
            e.address,
            e.national_id AS nationalId,
            e.department_id AS departmentId,
            e.position,
            e.hire_date AS hireDate,
            e.employment_status AS employmentStatus,
            e.created_at AS createdAt,
            e.updated_at AS updatedAt
        FROM employee e
        WHERE e.email = @email
    `,

    /**
     * Kiểm tra email đã tồn tại chưa (exclude employee hiện tại nếu đang update)
     */
    checkEmailExists: `
        SELECT COUNT(*) AS count
        FROM employee
        WHERE email = @email
          AND (@excludeEmployeeId IS NULL OR employee_id != @excludeEmployeeId)
    `,

    /**
     * Kiểm tra CCCD/CMND đã tồn tại chưa
     */
    checkNationalIdExists: `
        SELECT COUNT(*) AS count
        FROM employee
        WHERE national_id = @nationalId
          AND (@excludeEmployeeId IS NULL OR employee_id != @excludeEmployeeId)
    `,

    /**
     * Tạo nhân viên mới
     */
    create: `
        INSERT INTO employee (
            full_name, dob, gender, email, phone, address, national_id,
            department_id, position, hire_date, employment_status
        )
        OUTPUT 
            inserted.employee_id AS employeeId,
            inserted.full_name AS fullName,
            inserted.dob,
            inserted.gender,
            inserted.email,
            inserted.phone,
            inserted.address,
            inserted.national_id AS nationalId,
            inserted.department_id AS departmentId,
            inserted.position,
            inserted.hire_date AS hireDate,
            inserted.employment_status AS employmentStatus,
            inserted.created_at AS createdAt,
            inserted.updated_at AS updatedAt
        VALUES (
            @fullName, @dob, @gender, @email, @phone, @address, @nationalId,
            @departmentId, @position, @hireDate, 
            COALESCE(@employmentStatus, 'active')
        )
    `,

    /**
     * Cập nhật thông tin nhân viên
     */
    update: `
        UPDATE employee
        SET 
            full_name = COALESCE(@fullName, full_name),
            dob = COALESCE(@dob, dob),
            gender = COALESCE(@gender, gender),
            email = COALESCE(@email, email),
            phone = COALESCE(@phone, phone),
            address = COALESCE(@address, address),
            national_id = COALESCE(@nationalId, national_id),
            department_id = @departmentId,  -- Cho phép set NULL
            position = COALESCE(@position, position),
            hire_date = COALESCE(@hireDate, hire_date),
            employment_status = COALESCE(@employmentStatus, employment_status),
            updated_at = GETDATE()
        OUTPUT 
            inserted.employee_id AS employeeId,
            inserted.full_name AS fullName,
            inserted.dob,
            inserted.gender,
            inserted.email,
            inserted.phone,
            inserted.address,
            inserted.national_id AS nationalId,
            inserted.department_id AS departmentId,
            inserted.position,
            inserted.hire_date AS hireDate,
            inserted.employment_status AS employmentStatus,
            inserted.created_at AS createdAt,
            inserted.updated_at AS updatedAt
        WHERE employee_id = @employeeId
    `,

    /**
     * Cập nhật trạng thái làm việc (nghỉ việc, sa thải...)
     */
    updateEmploymentStatus: `
        UPDATE employee
        SET 
            employment_status = @employmentStatus,
            updated_at = GETDATE()
        OUTPUT 
            inserted.employee_id AS employeeId,
            inserted.full_name AS fullName,
            inserted.employment_status AS employmentStatus,
            inserted.updated_at AS updatedAt
        WHERE employee_id = @employeeId
    `,

    /**
     * Xóa nhân viên (soft delete - chuyển trạng thái thành terminated)
     */
    softDelete: `
        UPDATE employee
        SET 
            employment_status = 'terminated',
            updated_at = GETDATE()
        WHERE employee_id = @employeeId
    `,

    /**
     * Xóa vĩnh viễn nhân viên (hard delete - cẩn thận!)
     */
    hardDelete: `
        DELETE FROM employee
        WHERE employee_id = @employeeId
    `,

    /**
     * Lấy danh sách nhân viên theo phòng ban
     */
    findByDepartment: `
        SELECT 
            e.employee_id AS employeeId,
            e.full_name AS fullName,
            e.email,
            e.phone,
            e.position,
            e.hire_date AS hireDate,
            e.employment_status AS employmentStatus
        FROM employee e
        WHERE e.department_id = @departmentId
          AND (@employmentStatus IS NULL OR e.employment_status = @employmentStatus)
        ORDER BY e.full_name ASC
    `,

    /**
     * Lấy thống kê nhân viên theo phòng ban
     */
    getStatisticsByDepartment: `
        SELECT 
            d.department_id AS departmentId,
            d.name AS departmentName,
            COUNT(e.employee_id) AS totalEmployees,
            SUM(CASE WHEN e.employment_status = 'active' THEN 1 ELSE 0 END) AS activeEmployees,
            SUM(CASE WHEN e.employment_status = 'inactive' THEN 1 ELSE 0 END) AS inactiveEmployees,
            SUM(CASE WHEN e.employment_status = 'terminated' THEN 1 ELSE 0 END) AS terminatedEmployees,
            SUM(CASE WHEN e.employment_status = 'resigned' THEN 1 ELSE 0 END) AS resignedEmployees
        FROM department d
        LEFT JOIN employee e ON d.department_id = e.department_id
        GROUP BY d.department_id, d.name
        ORDER BY totalEmployees DESC
    `,

    /**
     * Lấy nhân viên mới nhất (cho dashboard)
     */
    getRecentEmployees: `
        SELECT TOP(@limit)
            e.employee_id AS employeeId,
            e.full_name AS fullName,
            e.email,
            e.position,
            d.name AS departmentName,
            e.hire_date AS hireDate,
            e.created_at AS createdAt
        FROM employee e
        LEFT JOIN department d ON e.department_id = d.department_id
        WHERE e.employment_status = 'active'
        ORDER BY e.created_at DESC
    `,

    /**
     * Tìm nhân viên có sinh nhật trong tháng
     */
    getBirthdaysInMonth: `
        SELECT 
            e.employee_id AS employeeId,
            e.full_name AS fullName,
            e.email,
            e.dob,
            DATEPART(DAY, e.dob) AS dayOfBirth,
            d.name AS departmentName
        FROM employee e
        LEFT JOIN department d ON e.department_id = d.department_id
        WHERE 
            e.employment_status = 'active'
            AND DATEPART(MONTH, e.dob) = @month
            AND DATEPART(YEAR, e.dob) <= @year
        ORDER BY DATEPART(DAY, e.dob) ASC
    `,

    /**
     * Lấy nhân viên sắp đến ngày kỷ niệm làm việc
     */
    getUpcomingWorkAnniversaries: `
        SELECT 
            e.employee_id AS employeeId,
            e.full_name AS fullName,
            e.email,
            e.hire_date AS hireDate,
            DATEDIFF(YEAR, e.hire_date, GETDATE()) AS yearsOfService,
            d.name AS departmentName
        FROM employee e
        LEFT JOIN department d ON e.department_id = d.department_id
        WHERE 
            e.employment_status = 'active'
            AND DATEPART(MONTH, e.hire_date) = @month
        ORDER BY DATEPART(DAY, e.hire_date) ASC
    `,

    /**
     * Tìm kiếm nhân viên nâng cao (full-text search)
     */
    search: `
        SELECT 
            e.employee_id AS employeeId,
            e.full_name AS fullName,
            e.email,
            e.phone,
            e.position,
            d.name AS departmentName,
            e.employment_status AS employmentStatus
        FROM employee e
        LEFT JOIN department d ON e.department_id = d.department_id
        WHERE 
            (
                @searchTerm IS NULL OR
                e.full_name LIKE '%' + @searchTerm + '%' OR
                e.email LIKE '%' + @searchTerm + '%' OR
                e.phone LIKE '%' + @searchTerm + '%' OR
                e.position LIKE '%' + @searchTerm + '%' OR
                e.national_id LIKE '%' + @searchTerm + '%'
            )
        ORDER BY 
            CASE 
                WHEN e.full_name LIKE @searchTerm + '%' THEN 1  -- Exact match đầu tiên
                WHEN e.full_name LIKE '%' + @searchTerm + '%' THEN 2  -- Contains
                ELSE 3
            END,
            e.full_name ASC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
    `,

    /**
     * Lấy tổng quan nhân viên (cho dashboard)
     */
    getOverview: `
        SELECT 
            COUNT(*) AS totalEmployees,
            SUM(CASE WHEN employment_status = 'active' THEN 1 ELSE 0 END) AS activeEmployees,
            SUM(CASE WHEN employment_status = 'inactive' THEN 1 ELSE 0 END) AS inactiveEmployees,
            SUM(CASE WHEN employment_status = 'terminated' THEN 1 ELSE 0 END) AS terminatedEmployees,
            SUM(CASE WHEN employment_status = 'resigned' THEN 1 ELSE 0 END) AS resignedEmployees,
            SUM(CASE WHEN DATEDIFF(MONTH, hire_date, GETDATE()) <= 3 THEN 1 ELSE 0 END) AS newHires,
            SUM(CASE WHEN gender = 'Male' THEN 1 ELSE 0 END) AS maleCount,
            SUM(CASE WHEN gender = 'Female' THEN 1 ELSE 0 END) AS femaleCount
        FROM employee
    `
};