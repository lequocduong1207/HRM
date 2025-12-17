export const UserSql = {
    /**
     * Tìm tất cả users
     * Hỗ trợ phân trang và lọc theo role/status
     */
    findAll: `
        SELECT 
            u.user_id AS userId,
            u.username,
            u.role,
            u.employee_id AS employeeId,
            e.full_name AS employeeName,
            e.email AS employeeEmail,
            u.is_active AS isActive,
            u.last_login AS lastLogin,
            u.created_at AS createdAt,
            u.updated_at AS updatedAt
        FROM users u
        LEFT JOIN employee e ON u.employee_id = e.employee_id
        WHERE 
            (@role IS NULL OR u.role = @role)
            AND (@isActive IS NULL OR u.is_active = @isActive)
            AND (@searchTerm IS NULL OR 
                u.username LIKE '%' + @searchTerm + '%' OR
                e.full_name LIKE '%' + @searchTerm + '%')
        ORDER BY u.created_at DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
    `,

    /**
     * Đếm tổng số users
     */
    count: `
        SELECT COUNT(*) AS total
        FROM users u
        LEFT JOIN employee e ON u.employee_id = e.employee_id
        WHERE 
            (@role IS NULL OR u.role = @role)
            AND (@isActive IS NULL OR u.is_active = @isActive)
            AND (@searchTerm IS NULL OR 
                u.username LIKE '%' + @searchTerm + '%' OR
                e.full_name LIKE '%' + @searchTerm + '%')
    `,

    /**
     * Tìm user theo ID
     */
    findById: `
        SELECT 
            u.user_id AS userId,
            u.username,
            u.password_hash AS passwordHash,
            u.role,
            u.employee_id AS employeeId,
            e.full_name AS employeeName,
            e.email AS employeeEmail,
            e.position AS employeePosition,
            d.name AS departmentName,
            u.is_active AS isActive,
            u.last_login AS lastLogin,
            u.created_at AS createdAt,
            u.updated_at AS updatedAt
        FROM users u
        LEFT JOIN employee e ON u.employee_id = e.employee_id
        LEFT JOIN department d ON e.department_id = d.department_id
        WHERE u.user_id = @userId
    `,

    /**
     * Tìm user theo username (dùng cho đăng nhập)
     */
    findByUsername: `
        SELECT 
            u.user_id AS userId,
            u.username,
            u.email,
            u.password_hash AS passwordHash,
            u.role,
            u.employee_id AS employeeId,
            e.full_name AS employeeName,
            u.is_active AS isActive,
            u.last_login AS lastLogin,
            u.created_at AS createdAt,
            u.updated_at AS updatedAt
        FROM users u
        LEFT JOIN employee e ON u.employee_id = e.employee_id
        WHERE u.username = @username
    `,

    /**
     * Tìm user theo email (dùng cho đăng nhập)
     */
    findByEmail: `
        SELECT 
            u.user_id AS userId,
            u.username,
            u.email,
            u.password_hash AS passwordHash,
            u.role,
            u.employee_id AS employeeId,
            e.full_name AS employeeName,
            u.is_active AS isActive,
            u.last_login AS lastLogin,
            u.created_at AS createdAt,
            u.updated_at AS updatedAt
        FROM users u
        LEFT JOIN employee e ON u.employee_id = e.employee_id
        WHERE u.email = @email
    `,

    /**
     * Tìm user theo employeeId
     */
    findByEmployeeId: `
        SELECT 
            u.user_id AS userId,
            u.username,
            u.password_hash AS passwordHash,
            u.role,
            u.employee_id AS employeeId,
            u.is_active AS isActive,
            u.last_login AS lastLogin,
            u.created_at AS createdAt,
            u.updated_at AS updatedAt
        FROM users u
        WHERE u.employee_id = @employeeId
    `,

    /**
     * Kiểm tra username đã tồn tại chưa
     */
    checkUsernameExists: `
        SELECT COUNT(*) AS count
        FROM users
        WHERE username = @username
          AND (@excludeUserId IS NULL OR user_id != @excludeUserId)
    `,

    /**
     * Kiểm tra email đã tồn tại chưa
     */
    checkEmailExists: `
        SELECT COUNT(*) AS count
        FROM users
        WHERE email = @email
          AND (@excludeUserId IS NULL OR user_id != @excludeUserId)
    `,

    /**
     * Tạo user mới
     */
    create: `
        INSERT INTO users (
            username, email, password_hash, role, employee_id, is_active
        )
        OUTPUT 
            inserted.user_id AS userId,
            inserted.username,
            inserted.email,
            inserted.role,
            inserted.employee_id AS employeeId,
            inserted.is_active AS isActive,
            inserted.created_at AS createdAt,
            inserted.updated_at AS updatedAt
        VALUES (
            @username, @email, @passwordHash, @role, @employeeId, 
            COALESCE(@isActive, 1)
        )
    `,

    /**
     * Cập nhật thông tin user
     */
    update: `
        UPDATE users
        SET 
            username = COALESCE(@username, username),
            email = COALESCE(@email, email),
            role = COALESCE(@role, role),
            employee_id = @employeeId,  -- Cho phép set NULL
            is_active = COALESCE(@isActive, is_active),
            password_hash = COALESCE(@passwordHash, password_hash),
            updated_at = GETDATE()
        OUTPUT 
            inserted.user_id AS userId,
            inserted.username,
            inserted.email,
            inserted.role,
            inserted.employee_id AS employeeId,
            inserted.is_active AS isActive,
            inserted.last_login AS lastLogin,
            inserted.created_at AS createdAt,
            inserted.updated_at AS updatedAt
        WHERE user_id = @userId
    `,

    /**
     * Cập nhật mật khẩu
     */
    updatePassword: `
        UPDATE users
        SET 
            password_hash = @passwordHash,
            updated_at = GETDATE()
        OUTPUT 
            inserted.user_id AS userId,
            inserted.username,
            inserted.updated_at AS updatedAt
        WHERE user_id = @userId
    `,

    /**
     * Cập nhật thời gian đăng nhập cuối
     */
    updateLastLogin: `
        UPDATE users
        SET 
            last_login = GETDATE(),
            updated_at = GETDATE()
        OUTPUT 
            inserted.user_id AS userId,
            inserted.last_login AS lastLogin
        WHERE user_id = @userId
    `,

    /**
     * Kích hoạt/vô hiệu hóa tài khoản
     */
    updateActiveStatus: `
        UPDATE users
        SET 
            is_active = @isActive,
            updated_at = GETDATE()
        OUTPUT 
            inserted.user_id AS userId,
            inserted.username,
            inserted.is_active AS isActive,
            inserted.updated_at AS updatedAt
        WHERE user_id = @userId
    `,

    /**
     * Xóa user
     */
    delete: `
        DELETE FROM users
        WHERE user_id = @userId
    `,

    /**
     * Lấy thống kê users theo role
     */
    getStatisticsByRole: `
        SELECT 
            role,
            COUNT(*) AS total,
            SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS active,
            SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) AS inactive
        FROM users
        GROUP BY role
        ORDER BY 
            CASE role
                WHEN 'admin' THEN 1
                WHEN 'hr_manager' THEN 2
                WHEN 'manager' THEN 3
                WHEN 'employee' THEN 4
            END
    `,

    /**
     * Lấy users không có employeeId (accounts chưa liên kết)
     */
    findUnlinkedAccounts: `
        SELECT 
            u.user_id AS userId,
            u.username,
            u.role,
            u.is_active AS isActive,
            u.created_at AS createdAt
        FROM users u
        WHERE u.employee_id IS NULL
        ORDER BY u.created_at DESC
    `,

    /**
     * Lấy users đăng nhập gần đây
     */
    getRecentLogins: `
        SELECT TOP(@limit)
            u.user_id AS userId,
            u.username,
            u.role,
            e.full_name AS employeeName,
            u.last_login AS lastLogin
        FROM users u
        LEFT JOIN employee e ON u.employee_id = e.employee_id
        WHERE u.last_login IS NOT NULL
        ORDER BY u.last_login DESC
    `,

    /**
     * Lấy tổng quan users (cho dashboard)
     */
    getOverview: `
        SELECT 
            COUNT(*) AS totalUsers,
            SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS activeUsers,
            SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) AS inactiveUsers,
            SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) AS admins,
            SUM(CASE WHEN role = 'hr_manager' THEN 1 ELSE 0 END) AS hrManagers,
            SUM(CASE WHEN role = 'manager' THEN 1 ELSE 0 END) AS managers,
            SUM(CASE WHEN role = 'employee' THEN 1 ELSE 0 END) AS employees
        FROM users
    `
};