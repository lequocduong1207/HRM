/**
 * API Constants
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
    },
    // Employees
    EMPLOYEES: {
        BASE: '/employees',
        BY_ID: (id: string) => `/employees/${id}`,
        ACTIVATE: (id: string) => `/employees/${id}/activate`,
        DEACTIVATE: (id: string) => `/employees/${id}/deactivate`,
    },
    // Departments
    DEPARTMENTS: {
        BASE: '/departments',
        BY_ID: (id: string) => `/departments/${id}`,
    },
    // Attendance
    ATTENDANCE: {
        BASE: '/attendance',
        BY_ID: (id: string) => `/attendance/${id}`,
        CHECK_IN: '/attendance/check-in',
        CHECK_OUT: '/attendance/check-out',
        BY_EMPLOYEE: (employeeId: string) => `/attendance/employee/${employeeId}`,
    },
    // Users (future)
    USERS: {
        BASE: '/users',
        BY_ID: (id: string) => `/users/${id}`,
    },
} as const;

/**
 * App Constants
 */

export const APP_NAME = 'HRM Admin';
export const APP_VERSION = '1.0.0';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const TIME_FORMAT = 'HH:mm';

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

/**
 * Local Storage Keys
 */

export const STORAGE_KEYS = {
    AUTH_TOKEN: 'hrm_auth_token',
    USER: 'hrm_user',
    THEME: 'hrm_theme',
} as const;

/**
 * Routes
 */

export const ROUTES = {
    // Public
    SIGN_IN: '/signin',
    
    // Dashboard
    HOME: '/',
    DASHBOARD: '/',
    
    // Employees
    EMPLOYEES: '/employees',
    EMPLOYEES_ADD: '/employees/add',
    EMPLOYEES_EDIT: (id: string) => `/employees/${id}/edit`,
    
    // Departments
    DEPARTMENTS: '/departments',
    DEPARTMENTS_ADD: '/departments/add',
    DEPARTMENTS_EDIT: (id: string) => `/departments/${id}/edit`,
    
    // Attendance
    ATTENDANCE: '/attendance',
    ATTENDANCE_HISTORY: '/attendance/history',
    
    // Leave
    LEAVE: '/leave',
    LEAVE_APPROVAL: '/leave/approval',
    LEAVE_HISTORY: '/leave/history',
    
    // Reports
    REPORTS: '/reports',
    REPORTS_ATTENDANCE: '/reports/attendance',
    REPORTS_EMPLOYEE: '/reports/employee',
    
    // Settings
    SETTINGS: '/settings',
    USERS: '/users',
    PROFILE: '/profile',
    
    // Others
    NOT_FOUND: '/404',
} as const;

/**
 * Status Options
 */

export const ATTENDANCE_STATUS_OPTIONS = [
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'half-day', label: 'Half Day' },
] as const;

export const USER_ROLE_OPTIONS = [
    { value: 'admin', label: 'Admin' },
    { value: 'employee', label: 'Employee' },
] as const;

/**
 * Validation Messages
 */

export const VALIDATION_MESSAGES = {
    REQUIRED: 'This field is required',
    EMAIL_INVALID: 'Please enter a valid email',
    PHONE_INVALID: 'Please enter a valid phone number',
    PASSWORD_MIN: 'Password must be at least 8 characters',
    PASSWORD_MATCH: 'Passwords do not match',
} as const;
