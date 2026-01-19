/**
 * RBAC Types - Frontend
 * Định nghĩa types cho Role-Based Access Control
 */

// Role hierarchy levels (matching backend)
export enum RoleLevel {
  ADMIN = 1,
  HR_MANAGER = 2,
  DEPARTMENT_MANAGER = 3,
  EMPLOYEE = 4,
}

export type RoleName = 'admin' | 'hr_manager' | 'department_manager' | 'employee';

// Role interface
export interface Role {
  _id: string;
  name: RoleName;
  displayName: string;
  description: string;
  hierarchy: RoleLevel;
  permissions: string[];
  isActive: boolean;
}

// User interface with role data
export interface User {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  role: RoleName; // Deprecated - for backward compatibility
  roleId: string;
  roleName?: RoleName;
  roleDisplayName?: string;
  departmentId?: string;
  permissions?: string[];
}

// Auth response from backend
export interface AuthData {
  user: User;
  token: string;
  refreshToken: string;
  role?: {
    _id: string;
    name: RoleName;
    displayName: string;
    hierarchy: RoleLevel;
    permissions: string[];
  };
}

// Permission format: resource:action:scope
export type Permission = string;

// Permission categories
export const PERMISSIONS = {
  EMPLOYEE: {
    CREATE: 'employee:create',
    READ_ALL: 'employee:read:all',
    READ_DEPT: 'employee:read:dept',
    READ_SELF: 'employee:read:self',
    UPDATE: 'employee:update',
    UPDATE_DEPT: 'employee:update:dept',
    UPDATE_SELF: 'employee:update:self',
    DELETE: 'employee:delete',
  },
  
  ATTENDANCE: {
    CREATE: 'attendance:create',
    READ_ALL: 'attendance:read:all',
    READ_DEPT: 'attendance:read:dept',
    READ_SELF: 'attendance:read:self',
    UPDATE: 'attendance:update',
    UPDATE_SELF: 'attendance:update:self',
    DELETE: 'attendance:delete',
    APPROVE: 'attendance:approve',
  },
  
  LEAVE: {
    CREATE: 'leave:create',
    READ_ALL: 'leave:read:all',
    READ_DEPT: 'leave:read:dept',
    READ_SELF: 'leave:read:self',
    UPDATE: 'leave:update',
    UPDATE_SELF: 'leave:update:self',
    DELETE: 'leave:delete',
    APPROVE: 'leave:approve',
    REJECT: 'leave:reject',
  },
  
  SALARY: {
    CREATE: 'salary:create',
    READ_ALL: 'salary:read:all',
    READ_SELF: 'salary:read:self',
    UPDATE: 'salary:update',
    DELETE: 'salary:delete',
    CALCULATE: 'salary:calculate',
  },
  
  DEPARTMENT: {
    CREATE: 'department:create',
    READ: 'department:read',
    UPDATE: 'department:update',
    DELETE: 'department:delete',
    ASSIGN_MANAGER: 'department:assign_manager',
  },
  
  USER: {
    CREATE: 'user:create',
    READ: 'user:read',
    READ_ALL: 'user:read:all',
    UPDATE: 'user:update',
    DELETE: 'user:delete',
    ACTIVATE: 'user:activate',
    DEACTIVATE: 'user:deactivate',
    RESET_PASSWORD: 'user:reset_password',
  },
  
  ROLE: {
    CREATE: 'role:create',
    READ: 'role:read',
    UPDATE: 'role:update',
    DELETE: 'role:delete',
    ASSIGN: 'role:assign',
  },
  
  AUDIT: {
    READ: 'audit:read',
    READ_ALL: 'audit:read:all',
  },
  
  REPORT: {
    ATTENDANCE: 'report:attendance',
    SALARY: 'report:salary',
    EMPLOYEE: 'report:employee',
    LEAVE: 'report:leave',
  },
} as const;

// Helper type to get all permission values
export type PermissionValue = typeof PERMISSIONS[keyof typeof PERMISSIONS][keyof typeof PERMISSIONS[keyof typeof PERMISSIONS]];
