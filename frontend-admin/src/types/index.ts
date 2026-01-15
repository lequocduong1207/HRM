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

export type UserRole = 'admin' | 'employee';

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
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    position: string;
    departmentId: IDepartment | string;
    salary: number;
    hireDate: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEmployeeRequest {
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
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

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half-day';

export interface IAttendance {
    _id: string;
    employeeId: IEmployee | string;
    date: string;
    checkInTime?: string;
    checkOutTime?: string;
    status: AttendanceStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CheckInRequest {
    employeeId: string;
    checkInTime?: string;
}

export interface CheckOutRequest {
    attendanceId: string;
    checkOutTime?: string;
}

export interface AttendanceFilterParams {
    employeeId?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
    status?: AttendanceStatus;
    page?: number;
    limit?: number;
}

/**
 * Leave Request Types (for future implementation)
 */

export type LeaveType = 'sick' | 'vacation' | 'personal' | 'other';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface ILeaveRequest {
    _id: string;
    employeeId: IEmployee | string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    status: LeaveStatus;
    approvedBy?: IUser | string;
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
