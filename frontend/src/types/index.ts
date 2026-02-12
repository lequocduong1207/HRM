/**
 * API Response Types
 */

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    statusCode?: number;
}

export interface PaginatedResponse<T = any> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

/**
 * User Types
 */

export type UserRole = 'admin' | 'hr_manager' | 'department_manager' | 'employee';

export interface IUser {
    _id: string;
    email: string;
    fullName: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
    user: IUser;
}

export interface CreateUserRequest {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    employeeId?: string;
}

export interface UpdateUserRequest extends Partial<Omit<CreateUserRequest, 'password'>> {
    isActive?: boolean;
}

/**
 * Employee Types
 */

export interface IEmployee {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    dob: Date;
    gender?: string;
    address: string;
    nationalId: string;
    position: string;
    departmentId: IDepartment | string;
    salary: number;
    hireDate: string;
    isActive: boolean;
    userId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEmployeeRequest {
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    gender?: string;
    address: string;
    nationalId: string;
    position: string;
    departmentId: string;
    salary: number;
    hireDate: string;
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
    isActive?: boolean;
}

/**
 * Department Types
 */

export interface IDepartment {
    _id: string;
    name: string;
    description?: string;
    managerId?: IEmployee | string;
    employeeCount?: number;
    employees?: IEmployee[];
    isDeleted?: boolean;
    deletedAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDepartmentRequest {
    name: string;
    description?: string;
    // managerId?: string;
}

export interface UpdateDepartmentRequest extends Partial<CreateDepartmentRequest> {}

/**
 * Attendance Types
 */

export interface IAttendance {
    _id: string;
    attendanceId?: number;
    employeeId: IEmployee | string;
    date: string;
    checkIn?: string;
    checkOut?: string;
    workHours?: number;
    isLate?: boolean;
    isEarlyLeave?: boolean;
    notes?: string;
    createdAt: string;
}

export interface CheckInRequest {
    location?: string;
    notes?: string;
}

export interface CheckOutRequest {
    location?: string;
    notes?: string;
}

export interface AttendanceFilterParams {
    employeeId?: string | number;
    date?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

/**
 * Leave Request Types
 */

export type LeaveType = 'Annual' | 'Sick' | 'Unpaid' | 'Maternity' | 'Paternity' | 'Other' | 'annual' | 'sick' | 'unpaid' | 'maternity' | 'paternity' | 'other';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface ILeaveRequest {
    _id: string;
    employeeId: IEmployee | string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason?: string;
    status: LeaveStatus;
    approvedBy?: IUser | string;
    approvedAt?: string;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Form Types
 */

export interface SelectOption {
    value: string;
    label: string;
}
