-- =====================================================
-- HRM (Human Resource Management) Database Schema
-- Database: SQL Server
-- Version: 1.0
-- Created: 2024
-- =====================================================

-- =====================================================
-- 1. BẢNG DEPARTMENT (PHÒNG BAN)
-- Mục đích: Quản lý các phòng ban/bộ phận trong công ty
-- =====================================================
CREATE TABLE department (
    -- ID tự động tăng, khóa chính
    department_id INT IDENTITY(1,1) PRIMARY KEY,
    
    -- Tên phòng ban (bắt buộc, không trùng)
    -- VD: "IT Department", "HR Department", "Sales"
    name NVARCHAR(100) NOT NULL UNIQUE,
    
    -- Mô tả chi tiết về phòng ban
    -- VD: "Phòng phụ trách công nghệ thông tin và phát triển phần mềm"
    description NVARCHAR(MAX),
    
    -- ID của trưởng phòng (tham chiếu đến bảng employee)
    -- NULL nếu chưa có trưởng phòng
    manager_id INT NULL,
    
    -- Ngày tạo bản ghi (tự động)
    created_at DATETIME DEFAULT GETDATE() NOT NULL,
    
    -- Ngày cập nhật lần cuối (cần trigger để tự động cập nhật)
    updated_at DATETIME DEFAULT GETDATE() NOT NULL
);

-- Tạo index cho việc tìm kiếm theo tên
CREATE INDEX IX_Department_Name ON department(name);

-- =====================================================
-- 2. BẢNG EMPLOYEE (NHÂN VIÊN)
-- Mục đích: Lưu trữ thông tin cá nhân và công việc của nhân viên
-- =====================================================
CREATE TABLE employee (
    -- ID tự động tăng, khóa chính
    employee_id INT IDENTITY(1,1) PRIMARY KEY,
    
    -- ===== THÔNG TIN CÁ NHÂN =====
    
    -- Họ và tên đầy đủ (bắt buộc)
    -- VD: "Nguyễn Văn An"
    full_name NVARCHAR(150) NOT NULL,
    
    -- Ngày sinh
    -- VD: 1990-05-15
    dob DATE,
    
    -- Giới tính (Male/Female/Other)
    gender NVARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    
    -- Email công ty hoặc cá nhân (duy nhất, không trùng)
    -- VD: "nguyenvanan@company.com"
    email NVARCHAR(150) UNIQUE,
    
    -- Số điện thoại liên lạc
    -- VD: "0901234567"
    phone NVARCHAR(30),
    
    -- Địa chỉ thường trú
    -- VD: "123 Đường ABC, Quận 1, TP.HCM"
    address NVARCHAR(MAX),
    
    -- Số CCCD/CMND (duy nhất, không trùng)
    -- VD: "001234567890"
    national_id NVARCHAR(20) UNIQUE,
    
    -- ===== THÔNG TIN CÔNG VIỆC =====
    
    -- ID phòng ban (tham chiếu đến bảng department)
    -- NULL nếu nhân viên chưa được phân phòng ban
    department_id INT,
    
    -- Chức vụ/Vị trí công việc
    -- VD: "Software Engineer", "HR Manager", "Sales Executive"
    position NVARCHAR(80),
    
    -- Ngày bắt đầu làm việc
    hire_date DATE,
    
    -- Trạng thái làm việc
    -- active: Đang làm việc
    -- inactive: Tạm nghỉ
    -- terminated: Bị sa thải
    -- resigned: Đã nghỉ việc
    employment_status NVARCHAR(20) DEFAULT 'active' 
        CHECK (employment_status IN ('active', 'inactive', 'terminated', 'resigned')),
    
    -- ===== AUDIT =====
    
    -- Ngày tạo bản ghi
    created_at DATETIME DEFAULT GETDATE() NOT NULL,
    
    -- Ngày cập nhật lần cuối
    updated_at DATETIME DEFAULT GETDATE() NOT NULL,
    
    -- ===== RÀNG BUỘC KHÓA NGOẠI =====
    
    -- Liên kết với bảng department
    -- ON DELETE SET NULL: Khi xóa phòng ban, employee.department_id = NULL
    CONSTRAINT FK_Employee_Department 
        FOREIGN KEY (department_id) 
        REFERENCES department(department_id) 
        ON DELETE SET NULL
);

-- Tạo indexes để tăng tốc độ truy vấn
CREATE INDEX IX_Employee_Department ON employee(department_id);
CREATE INDEX IX_Employee_Email ON employee(email);
CREATE INDEX IX_Employee_Status ON employee(employment_status);

-- =====================================================
-- 3. BẢNG USERS (TÀI KHOẢN ĐĂNG NHẬP)
-- Mục đích: Quản lý tài khoản đăng nhập và phân quyền
-- =====================================================
CREATE TABLE users (
    -- ID tự động tăng, khóa chính
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    
    -- Tên đăng nhập (duy nhất, không trùng, bắt buộc)
    -- VD: "admin", "nguyenvanan"
    username NVARCHAR(100) NOT NULL UNIQUE,
    
    -- Email đăng nhập (duy nhất, không trùng, bắt buộc)
    -- VD: "admin@hrm.com", "nguyenvanan@company.com"
    email NVARCHAR(150) NOT NULL UNIQUE,
    
    -- Mật khẩu đã được hash bằng bcrypt (bắt buộc)
    -- VD: "$2b$10$abcdefghijklmnopqrstuvwxyz..."
    -- KHÔNG BAO GIỜ lưu mật khẩu dạng plain text
    password_hash NVARCHAR(MAX) NOT NULL,
    
    -- Vai trò/Quyền hạn của user
    -- admin: Quản trị viên (toàn quyền)
    -- hr_manager: Quản lý nhân sự
    -- manager: Quản lý phòng ban
    -- employee: Nhân viên thông thường
    role NVARCHAR(30) DEFAULT 'employee' 
        CHECK (role IN ('admin', 'hr_manager', 'manager', 'employee')),
    
    -- Liên kết với nhân viên (1 user = 1 employee)
    -- NULL nếu là tài khoản hệ thống (như super admin)
    employee_id INT UNIQUE,
    
    -- Tài khoản có đang hoạt động không?
    -- 0 = Bị vô hiệu hóa, 1 = Hoạt động bình thường
    is_active BIT DEFAULT 1 NOT NULL,
    
    -- Thời điểm đăng nhập lần cuối
    -- Dùng để theo dõi hoạt động user
    last_login DATETIME,
    
    -- ===== AUDIT =====
    created_at DATETIME DEFAULT GETDATE() NOT NULL,
    updated_at DATETIME DEFAULT GETDATE() NOT NULL,
    
    -- ===== RÀNG BUỘC KHÓA NGOẠI =====
    
    -- Liên kết với employee
    -- ON DELETE CASCADE: Khi xóa employee thì xóa luôn tài khoản user
    CONSTRAINT FK_Users_Employee 
        FOREIGN KEY (employee_id) 
        REFERENCES employee(employee_id) 
        ON DELETE CASCADE
);

-- Index cho việc đăng nhập (tìm theo username và email)
CREATE INDEX IX_Users_Username ON users(username);
CREATE INDEX IX_Users_Email ON users(email);

-- =====================================================
-- 4. BẢNG ATTENDANCE (CHẤM CÔNG)
-- Mục đích: Ghi nhận giờ vào/ra làm việc hàng ngày
-- =====================================================
CREATE TABLE attendance (
    -- ID tự động tăng, khóa chính
    attendance_id INT IDENTITY(1,1) PRIMARY KEY,
    
    -- ID nhân viên (bắt buộc)
    employee_id INT NOT NULL,
    
    -- Ngày chấm công (bắt buộc)
    -- VD: 2024-12-09
    date DATE NOT NULL,
    
    -- Giờ check-in (giờ vào làm)
    -- VD: 08:30:00
    -- NULL nếu chưa check-in
    check_in TIME,
    
    -- Giờ check-out (giờ ra về)
    -- VD: 17:45:00
    -- NULL nếu chưa check-out
    check_out TIME,
    
    -- Tổng số giờ làm việc (computed column - tự động tính)
    -- Được tính bằng: (check_out - check_in) / 60 phút
    -- VD: 8.5 giờ
    total_hours AS (
        CASE 
            WHEN check_in IS NOT NULL AND check_out IS NOT NULL 
            THEN DATEDIFF(MINUTE, check_in, check_out) / 60.0
            ELSE NULL 
        END
    ) PERSISTED,
    
    -- Có đi muộn không? (1 = Có, 0 = Không)
    -- Logic: check_in > 08:30:00
    is_late BIT DEFAULT 0,
    
    -- Có về sớm không? (1 = Có, 0 = Không)
    -- Logic: check_out < 17:30:00
    is_early_leave BIT DEFAULT 0,
    
    -- Ghi chú (lý do đi muộn/về sớm, hoặc công tác...)
    -- VD: "Đi muộn do kẹt xe", "Công tác ngoài"
    note NVARCHAR(MAX),
    
    -- ===== AUDIT =====
    created_at DATETIME DEFAULT GETDATE() NOT NULL,
    
    -- ===== RÀNG BUỘC KHÓA NGOẠI =====
    
    -- Liên kết với employee
    -- ON DELETE CASCADE: Khi xóa employee thì xóa luôn lịch sử chấm công
    CONSTRAINT FK_Attendance_Employee 
        FOREIGN KEY (employee_id) 
        REFERENCES employee(employee_id) 
        ON DELETE CASCADE,
    
    -- Một nhân viên chỉ có 1 bản ghi chấm công cho 1 ngày
    CONSTRAINT UQ_Attendance_Employee_Date 
        UNIQUE (employee_id, date)
);

-- Indexes để tăng tốc độ truy vấn
CREATE INDEX IX_Attendance_Employee_Date ON attendance(employee_id, date);
CREATE INDEX IX_Attendance_Date ON attendance(date);

-- =====================================================
-- 5. BẢNG LEAVE_REQUEST (ĐƠN XIN NGHỈ PHÉP)
-- Mục đích: Quản lý các đơn xin nghỉ của nhân viên
-- =====================================================
CREATE TABLE leave_request (
    -- ID tự động tăng, khóa chính
    leave_id INT IDENTITY(1,1) PRIMARY KEY,
    
    -- ID nhân viên xin nghỉ (bắt buộc)
    employee_id INT NOT NULL,
    
    -- Loại nghỉ phép
    -- annual_leave: Nghỉ phép năm
    -- sick_leave: Nghỉ ốm
    -- unpaid_leave: Nghỉ không lương
    -- maternity_leave: Nghỉ thai sản
    -- other: Loại khác
    leave_type NVARCHAR(30) NOT NULL 
        CHECK (leave_type IN ('annual_leave', 'sick_leave', 'unpaid_leave', 'maternity_leave', 'other')),
    
    -- Ngày bắt đầu nghỉ (bắt buộc)
    start_date DATE NOT NULL,
    
    -- Ngày kết thúc nghỉ (bắt buộc)
    end_date DATE NOT NULL,
    
    -- Tổng số ngày nghỉ (computed column - tự động tính)
    -- Công thức: (end_date - start_date) + 1
    -- VD: Nghỉ từ 10/12 đến 12/12 = 3 ngày
    total_days AS (DATEDIFF(DAY, start_date, end_date) + 1) PERSISTED,
    
    -- Lý do xin nghỉ
    -- VD: "Bị cảm nặng", "Về quê ăn Tết"
    reason NVARCHAR(MAX),
    
    -- Trạng thái đơn
    -- pending: Chờ duyệt
    -- approved: Đã được phê duyệt
    -- rejected: Bị từ chối
    -- cancelled: Nhân viên hủy
    status NVARCHAR(20) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    
    -- ID người phê duyệt (manager hoặc HR)
    -- NULL nếu chưa có người duyệt
    approver_id INT,
    
    -- Thời điểm phê duyệt
    -- NULL nếu chưa được duyệt
    approved_at DATETIME,
    
    -- Lý do từ chối (nếu status = 'rejected')
    -- VD: "Thời điểm này công ty đang bận, không thể nghỉ"
    rejection_reason NVARCHAR(MAX),
    
    -- ===== AUDIT =====
    created_at DATETIME DEFAULT GETDATE() NOT NULL,
    updated_at DATETIME DEFAULT GETDATE() NOT NULL,
    
    -- ===== RÀNG BUỘC KHÓA NGOẠI =====
    
    -- Liên kết với nhân viên xin nghỉ
    -- ON DELETE CASCADE: Khi xóa employee thì xóa luôn đơn nghỉ phép
    CONSTRAINT FK_LeaveRequest_Employee 
        FOREIGN KEY (employee_id) 
        REFERENCES employee(employee_id) 
        ON DELETE CASCADE,
    
    -- Liên kết với người phê duyệt
    -- ON DELETE NO ACTION: Không cho xóa người duyệt nếu còn đơn liên quan
    CONSTRAINT FK_LeaveRequest_Approver 
        FOREIGN KEY (approver_id) 
        REFERENCES employee(employee_id) 
        ON DELETE NO ACTION,
    
    -- Ngày kết thúc phải >= ngày bắt đầu
    CONSTRAINT CHK_LeaveRequest_Dates 
        CHECK (end_date >= start_date)
);

-- Indexes
CREATE INDEX IX_LeaveRequest_Employee ON leave_request(employee_id);
CREATE INDEX IX_LeaveRequest_Status ON leave_request(status);
CREATE INDEX IX_LeaveRequest_Dates ON leave_request(start_date, end_date);

-- =====================================================
-- 6. BẢNG SALARY (BẢNG LƯƠNG)
-- Mục đích: Quản lý thông tin lương hàng tháng
-- =====================================================
CREATE TABLE salary (
    -- ID tự động tăng, khóa chính
    salary_id INT IDENTITY(1,1) PRIMARY KEY,
    
    -- ID nhân viên (bắt buộc)
    employee_id INT NOT NULL,
    
    -- Lương cơ bản (theo hợp đồng)
    -- VD: 15000000 (15 triệu VNĐ)
    base_salary DECIMAL(12,2) DEFAULT 0 NOT NULL,
    
    -- Phụ cấp (ăn trưa, xăng xe, điện thoại...)
    -- VD: 2000000 (2 triệu VNĐ)
    allowance DECIMAL(12,2) DEFAULT 0 NOT NULL,
    
    -- Thưởng (KPI, dự án, lễ tết...)
    -- VD: 5000000 (5 triệu VNĐ)
    bonus DECIMAL(12,2) DEFAULT 0 NOT NULL,
    
    -- Khấu trừ (BHXH, BHYT, BHTN, thuế thu nhập cá nhân, phạt...)
    -- VD: 3000000 (3 triệu VNĐ)
    deduction DECIMAL(12,2) DEFAULT 0 NOT NULL,
    
    -- Tổng lương thực nhận (computed column - tự động tính)
    -- Công thức: base_salary + allowance + bonus - deduction
    -- VD: 15tr + 2tr + 5tr - 3tr = 19 triệu
    total_salary AS (base_salary + allowance + bonus - deduction) PERSISTED,
    
    -- Tháng tính lương (1-12)
    month INT NOT NULL 
        CHECK (month BETWEEN 1 AND 12),
    
    -- Năm tính lương
    -- VD: 2024
    year INT NOT NULL 
        CHECK (year >= 2000),
    
    -- Trạng thái thanh toán
    -- pending: Chưa thanh toán
    -- paid: Đã thanh toán
    -- cancelled: Đã hủy
    payment_status NVARCHAR(20) DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
    
    -- Ngày thực tế thanh toán lương
    -- VD: 2024-12-05
    payment_date DATE,
    
    -- ===== AUDIT =====
    created_at DATETIME DEFAULT GETDATE() NOT NULL,
    updated_at DATETIME DEFAULT GETDATE() NOT NULL,
    
    -- ===== RÀNG BUỘC KHÓA NGOẠI =====
    
    -- Liên kết với employee
    -- ON DELETE CASCADE: Khi xóa employee thì xóa luôn lịch sử lương
    CONSTRAINT FK_Salary_Employee 
        FOREIGN KEY (employee_id) 
        REFERENCES employee(employee_id) 
        ON DELETE CASCADE,
    
    -- Một nhân viên chỉ có 1 bảng lương cho 1 tháng cụ thể
    CONSTRAINT UQ_Salary_Employee_Month_Year 
        UNIQUE (employee_id, month, year)
);

-- Indexes
CREATE INDEX IX_Salary_Employee_Month_Year ON salary(employee_id, month, year);
CREATE INDEX IX_Salary_Payment_Status ON salary(payment_status);

-- =====================================================
-- 7. RÀNG BUỘC KHÓA NGOẠI BỔ SUNG
-- (Thêm sau khi tất cả các bảng đã được tạo)
-- =====================================================

-- Liên kết department.manager_id với employee.employee_id
-- Một phòng ban có một trưởng phòng (là một nhân viên)
ALTER TABLE department
ADD CONSTRAINT FK_Department_Manager 
    FOREIGN KEY (manager_id) 
    REFERENCES employee(employee_id) 
    ON DELETE SET NULL;

-- =====================================================
-- 8. TRIGGERS TỰ ĐỘNG CẬP NHẬT updated_at
-- =====================================================

-- Trigger cho bảng department
CREATE TRIGGER trg_Department_UpdatedAt
ON department
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE department
    SET updated_at = GETDATE()
    FROM department d
    INNER JOIN inserted i ON d.department_id = i.department_id;
END;
GO

-- Trigger cho bảng employee
CREATE TRIGGER trg_Employee_UpdatedAt
ON employee
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE employee
    SET updated_at = GETDATE()
    FROM employee e
    INNER JOIN inserted i ON e.employee_id = i.employee_id;
END;
GO

-- Trigger cho bảng users
CREATE TRIGGER trg_Users_UpdatedAt
ON users
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE users
    SET updated_at = GETDATE()
    FROM users u
    INNER JOIN inserted i ON u.user_id = i.user_id;
END;
GO

-- Trigger cho bảng leave_request
CREATE TRIGGER trg_LeaveRequest_UpdatedAt
ON leave_request
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE leave_request
    SET updated_at = GETDATE()
    FROM leave_request lr
    INNER JOIN inserted i ON lr.leave_id = i.leave_id;
END;
GO

-- Trigger cho bảng salary
CREATE TRIGGER trg_Salary_UpdatedAt
ON salary
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE salary
    SET updated_at = GETDATE()
    FROM salary s
    INNER JOIN inserted i ON s.salary_id = i.salary_id;
END;
GO

-- =====================================================
-- 9. DỮ LIỆU MẪU (OPTIONAL)
-- =====================================================

-- Tạo phòng ban mẫu
INSERT INTO department (name, description) VALUES
('IT Department', N'Phòng Công nghệ Thông tin - Phát triển và bảo trì hệ thống'),
('HR Department', N'Phòng Nhân sự - Quản lý và phát triển nguồn nhân lực'),
('Sales Department', N'Phòng Kinh doanh - Phụ trách bán hàng và chăm sóc khách hàng'),
('Finance Department', N'Phòng Tài chính - Quản lý tài chính và kế toán');

-- Tạo nhân viên mẫu
INSERT INTO employee (full_name, dob, gender, email, phone, department_id, position, hire_date, employment_status) VALUES
(N'Nguyễn Văn An', '1990-05-15', 'Male', 'nguyenvanan@company.com', '0901234567', 1, 'Software Engineer', '2020-01-15', 'active'),
(N'Trần Thị Bình', '1992-08-20', 'Female', 'tranthibinh@company.com', '0912345678', 2, 'HR Manager', '2019-03-10', 'active'),
(N'Lê Văn Cường', '1988-12-10', 'Male', 'levancuong@company.com', '0923456789', 3, 'Sales Executive', '2021-06-01', 'active');

-- Tạo tài khoản admin
INSERT INTO users (username, password_hash, role, employee_id, is_active) VALUES
('admin', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'admin', NULL, 1),
('nguyenvanan', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'employee', 1, 1),
('tranthibinh', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'hr_manager', 2, 1);

-- =====================================================
-- KẾT THÚC SCHEMA
-- =====================================================