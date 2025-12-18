export const DepartmentSql = {
    /**
     * Tìm tất cả phòng ban
     */
    findAll: `
        SELECT 
            d.department_id AS departmentId,
            d.name,
            d.description,
            d.manager_id AS managerId,
            e.full_name AS managerName,
            COUNT(emp.employee_id) AS employeeCount,
            d.created_at AS createdAt,
            d.updated_at AS updatedAt
        FROM department d
        LEFT JOIN employee e ON d.manager_id = e.employee_id
        LEFT JOIN employee emp ON emp.department_id = d.department_id
        WHERE 
            (@searchTerm IS NULL OR d.name LIKE '%' + @searchTerm + '%')
        GROUP BY 
            d.department_id,
            d.name,
            d.description,
            d.manager_id,
            e.full_name,
            d.created_at,
            d.updated_at
        ORDER BY d.name
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
    `,

    /**
     * Đếm tổng số phòng ban (cho phân trang)
     */
    count: `
        SELECT COUNT(*) AS total
        FROM department d
        WHERE 
            (@searchTerm IS NULL OR d.name LIKE '%' + @searchTerm + '%')
    `,

    /**
     * Tìm phòng ban theo ID
     */
    findById: `
        SELECT 
            d.department_id AS departmentId,
            d.name,
            d.description,
            d.manager_id AS managerId,
            e.full_name AS managerName,
            e.email AS managerEmail,
            e.phone AS managerPhone,
            COUNT(emp.employee_id) AS employeeCount,
            d.created_at AS createdAt,
            d.updated_at AS updatedAt
        FROM department d
        LEFT JOIN employee e ON d.manager_id = e.employee_id
        LEFT JOIN employee emp ON emp.department_id = d.department_id
        WHERE d.department_id = @departmentId
        GROUP BY 
            d.department_id,
            d.name,
            d.description,
            d.manager_id,
            e.full_name,
            e.email,
            e.phone,
            d.created_at,
            d.updated_at
    `,

    /**
     * Tìm phòng ban theo tên
     */
    findByName: `
        SELECT 
            d.department_id AS departmentId,
            d.name,
            d.description,
            d.manager_id AS managerId,
            d.created_at AS createdAt,
            d.updated_at AS updatedAt
        FROM department d
        WHERE d.name = @name
    `,

    /**
     * Kiểm tra tên phòng ban đã tồn tại chưa
     */
    checkNameExists: `
        SELECT COUNT(*) AS count
        FROM department
        WHERE name = @name
            AND (@excludeDepartmentId IS NULL OR department_id != @excludeDepartmentId)
    `,

    /**
     * Tạo phòng ban mới
     */
    create: `
        INSERT INTO department (name, description, manager_id)
        OUTPUT 
            INSERTED.department_id AS departmentId,
            INSERTED.name,
            INSERTED.description,
            INSERTED.manager_id AS managerId,
            INSERTED.created_at AS createdAt,
            INSERTED.updated_at AS updatedAt
        VALUES (@name, @description, @managerId)
    `,

    /**
     * Cập nhật thông tin phòng ban
     */
    update: `
        UPDATE department
        SET
            name = COALESCE(@name, name),
            description = CASE WHEN @description IS NULL THEN description ELSE @description END,
            manager_id = CASE WHEN @managerId IS NULL THEN manager_id ELSE @managerId END,
            updated_at = GETDATE()
        OUTPUT 
            INSERTED.department_id AS departmentId,
            INSERTED.name,
            INSERTED.description,
            INSERTED.manager_id AS managerId,
            INSERTED.created_at AS createdAt,
            INSERTED.updated_at AS updatedAt
        WHERE department_id = @departmentId
    `,

    /**
     * Xóa phòng ban
     */
    delete: `
        DELETE FROM department
        WHERE department_id = @departmentId
    `,

    /**
     * Lấy tất cả phòng ban (không phân trang, dùng cho dropdown)
     */
    getAllSimple: `
        SELECT 
            department_id AS departmentId,
            name,
            description
        FROM department
        ORDER BY name
    `,

    /**
     * Lấy thống kê nhân viên theo phòng ban
     */
    getStatistics: `
        SELECT 
            d.department_id AS departmentId,
            d.name AS departmentName,
            d.manager_id AS managerId,
            e.full_name AS managerName,
            COUNT(emp.employee_id) AS totalEmployees,
            SUM(CASE WHEN emp.employment_status = 'active' THEN 1 ELSE 0 END) AS activeEmployees,
            SUM(CASE WHEN emp.employment_status = 'inactive' THEN 1 ELSE 0 END) AS inactiveEmployees
        FROM department d
        LEFT JOIN employee e ON d.manager_id = e.employee_id
        LEFT JOIN employee emp ON emp.department_id = d.department_id
        GROUP BY 
            d.department_id,
            d.name,
            d.manager_id,
            e.full_name
        ORDER BY d.name
    `,

    /**
     * Kiểm tra employee có phải là manager của department không
     */
    isManager: `
        SELECT COUNT(*) AS count
        FROM department
        WHERE department_id = @departmentId
            AND manager_id = @employeeId
    `
};
