const PERMISSIONS = {
  // Employee Management
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
  
  // Attendance Management
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
  
  // Leave Management
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
  
  // Salary Management
  SALARY: {
    CREATE: 'salary:create',
    READ_ALL: 'salary:read:all',
    READ_SELF: 'salary:read:self',
    UPDATE: 'salary:update',
    DELETE: 'salary:delete',
    CALCULATE: 'salary:calculate',
  },
  
  // Department Management
  DEPARTMENT: {
    CREATE: 'department:create',
    READ: 'department:read',
    UPDATE: 'department:update',
    DELETE: 'department:delete',
    ASSIGN_MANAGER: 'department:assign_manager',
  },
  
  // User Management
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
  
  // Role Management
  ROLE: {
    CREATE: 'role:create',
    READ: 'role:read',
    UPDATE: 'role:update',
    DELETE: 'role:delete',
    ASSIGN: 'role:assign',
  },
  
  // Audit Logs
  AUDIT: {
    READ: 'audit:read',
    READ_ALL: 'audit:read:all',
  },
  
  // Reports
  REPORT: {
    ATTENDANCE: 'report:attendance',
    SALARY: 'report:salary',
    EMPLOYEE: 'report:employee',
    LEAVE: 'report:leave',
  },
} as const;

/**
 * Permission Groups - Nhóm các permissions thường dùng cùng nhau
 */
const PERMISSION_GROUPS = {
  EMPLOYEE_FULL: [
    PERMISSIONS.EMPLOYEE.CREATE,
    PERMISSIONS.EMPLOYEE.READ_ALL,
    PERMISSIONS.EMPLOYEE.UPDATE,
    PERMISSIONS.EMPLOYEE.DELETE,
  ],
  
  EMPLOYEE_DEPT_MANAGER: [
    PERMISSIONS.EMPLOYEE.READ_DEPT,
    PERMISSIONS.EMPLOYEE.UPDATE_DEPT,
  ],
  
  ATTENDANCE_FULL: [
    PERMISSIONS.ATTENDANCE.CREATE,
    PERMISSIONS.ATTENDANCE.READ_ALL,
    PERMISSIONS.ATTENDANCE.UPDATE,
    PERMISSIONS.ATTENDANCE.DELETE,
    PERMISSIONS.ATTENDANCE.APPROVE,
  ],
  
  LEAVE_FULL: [
    PERMISSIONS.LEAVE.CREATE,
    PERMISSIONS.LEAVE.READ_ALL,
    PERMISSIONS.LEAVE.UPDATE,
    PERMISSIONS.LEAVE.DELETE,
    PERMISSIONS.LEAVE.APPROVE,
    PERMISSIONS.LEAVE.REJECT,
  ],
};

/**
 * Flatten tất cả permissions thành array
 */
const ALL_PERMISSIONS = Object.values(PERMISSIONS)
  .flatMap(category => Object.values(category));

/**
 * Type helper cho permission
 */
export type PermissionType = typeof ALL_PERMISSIONS[number];

/**
 * Default Roles Configuration
 */
export interface IPermission {
  resource: string;
  actions: string[];
}

export interface IRoleConfig {
  name: string;
  displayName: string;
  description: string;
  hierarchy: number;
  permissions: string[];
  isSystemRole: boolean;
  isActive: boolean;
}

const DEFAULT_ROLES: Record<string, IRoleConfig> = {
  ADMIN: {
    name: 'admin',
    displayName: 'Administrator',
    description: 'Full system access with all permissions',
    hierarchy: 1,
    permissions: ALL_PERMISSIONS,
    isSystemRole: true,
    isActive: true,
  },
  
  HR_MANAGER: {
    name: 'hr_manager',
    displayName: 'HR Manager',
    description: 'Manage employees, attendance, leaves, and salaries',
    hierarchy: 2,
    permissions: [
      // Employee - Full access
      ...PERMISSION_GROUPS.EMPLOYEE_FULL,
      
      // Attendance - Full access
      ...PERMISSION_GROUPS.ATTENDANCE_FULL,
      
      // Leave - Full access
      ...PERMISSION_GROUPS.LEAVE_FULL,
      
      // Salary - Full access
      PERMISSIONS.SALARY.CREATE,
      PERMISSIONS.SALARY.READ_ALL,
      PERMISSIONS.SALARY.UPDATE,
      PERMISSIONS.SALARY.DELETE,
      PERMISSIONS.SALARY.CALCULATE,
      
      // Department - Read only
      PERMISSIONS.DEPARTMENT.READ,
      
      // Reports
      PERMISSIONS.REPORT.ATTENDANCE,
      PERMISSIONS.REPORT.EMPLOYEE,
      PERMISSIONS.REPORT.SALARY,
      PERMISSIONS.REPORT.LEAVE,
      
      // Audit - Read all
      PERMISSIONS.AUDIT.READ_ALL,
    ],
    isSystemRole: true,
    isActive: true,
  },
  
  DEPARTMENT_MANAGER: {
    name: 'department_manager',
    displayName: 'Department Manager',
    description: 'Manage department employees, attendance, and leaves',
    hierarchy: 3,
    permissions: [
      // Employee - Department only
      ...PERMISSION_GROUPS.EMPLOYEE_DEPT_MANAGER,
      PERMISSIONS.EMPLOYEE.READ_SELF,
      
      // Attendance - Department scope
      PERMISSIONS.ATTENDANCE.READ_DEPT,
      PERMISSIONS.ATTENDANCE.APPROVE,
      PERMISSIONS.ATTENDANCE.READ_SELF,
      PERMISSIONS.ATTENDANCE.CREATE,
      
      // Leave - Department scope
      PERMISSIONS.LEAVE.READ_DEPT,
      PERMISSIONS.LEAVE.APPROVE,
      PERMISSIONS.LEAVE.REJECT,
      PERMISSIONS.LEAVE.READ_SELF,
      PERMISSIONS.LEAVE.CREATE,
      
      // Salary - Self only
      PERMISSIONS.SALARY.READ_SELF,
      
      // Department - Read only
      PERMISSIONS.DEPARTMENT.READ,
      
      // Reports - Limited
      PERMISSIONS.REPORT.ATTENDANCE,
      PERMISSIONS.REPORT.LEAVE,
      
      // Audit - Own only
      PERMISSIONS.AUDIT.READ,
    ],
    isSystemRole: true,
    isActive: true,
  },
  
  EMPLOYEE: {
    name: 'employee',
    displayName: 'Employee',
    description: 'Basic employee access - view and update own information',
    hierarchy: 4,
    permissions: [
      // Employee - Self only
      PERMISSIONS.EMPLOYEE.READ_SELF,
      PERMISSIONS.EMPLOYEE.UPDATE_SELF,
      
      // Attendance - Self only
      PERMISSIONS.ATTENDANCE.CREATE,
      PERMISSIONS.ATTENDANCE.READ_SELF,
      PERMISSIONS.ATTENDANCE.UPDATE_SELF,
      
      // Leave - Self only
      PERMISSIONS.LEAVE.CREATE,
      PERMISSIONS.LEAVE.READ_SELF,
      PERMISSIONS.LEAVE.UPDATE_SELF,
      
      // Salary - Self only
      PERMISSIONS.SALARY.READ_SELF,
      
      // Department - Read only
      PERMISSIONS.DEPARTMENT.READ,
      
      // Audit - Own only
      PERMISSIONS.AUDIT.READ,
    ],
    isSystemRole: true,
    isActive: true,
  },
};

/**
 * Helper function để group permissions theo resource
 */
const groupPermissionsByResource = (permissions: string[]): IPermission[] => {
  const grouped: Record<string, Set<string>> = {};
  
  permissions.forEach(permission => {
    const [resource, ...actionParts] = permission.split(':');
    const action = actionParts.join(':');
    
    if (!grouped[resource]) {
      grouped[resource] = new Set();
    }
    grouped[resource].add(action);
  });
  
  return Object.entries(grouped).map(([resource, actions]) => ({
    resource,
    actions: Array.from(actions),
  }));
};

export {   
  PERMISSIONS,
  PERMISSION_GROUPS,
  ALL_PERMISSIONS,
  DEFAULT_ROLES,
  groupPermissionsByResource,
};