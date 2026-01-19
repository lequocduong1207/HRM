/**
 * usePermission Hook
 * Custom hook để check permissions trong React components
 */

import { useAuth } from '../context/AuthContext';
import { Permission, RoleLevel } from '../types/rbac.types';

export function usePermission() {
  const { user } = useAuth();

  /**
   * Check if user has a specific permission
   * @param permission - Permission string (e.g., 'employee:read:all')
   * @returns boolean
   */
  const hasPermission = (permission: Permission): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  /**
   * Check if user has ANY of the provided permissions (OR logic)
   * @param permissions - Array of permission strings
   * @returns boolean
   */
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!user || !user.permissions) return false;
    return permissions.some(p => user.permissions!.includes(p));
  };

  /**
   * Check if user has ALL of the provided permissions (AND logic)
   * @param permissions - Array of permission strings
   * @returns boolean
   */
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!user || !user.permissions) return false;
    return permissions.every(p => user.permissions!.includes(p));
  };

  /**
   * Check if user's role is at or above a certain hierarchy level
   * @param minLevel - Minimum role level required
   * @returns boolean
   */
  const hasRoleLevel = (minLevel: RoleLevel): boolean => {
    if (!user) return false;
    
    // Map role names to hierarchy levels
    const roleHierarchy: Record<string, RoleLevel> = {
      admin: RoleLevel.ADMIN,
      hr_manager: RoleLevel.HR_MANAGER,
      department_manager: RoleLevel.DEPARTMENT_MANAGER,
      employee: RoleLevel.EMPLOYEE,
    };

    const userLevel = roleHierarchy[user.roleName || user.role];
    if (userLevel === undefined) return false;

    // Lower number = higher hierarchy (admin = 1, employee = 4)
    return userLevel <= minLevel;
  };

  /**
   * Check if user is Admin
   * @returns boolean
   */
  const isAdmin = (): boolean => {
    return hasRoleLevel(RoleLevel.ADMIN);
  };

  /**
   * Check if user is HR Manager or above
   * @returns boolean
   */
  const isHRManager = (): boolean => {
    return hasRoleLevel(RoleLevel.HR_MANAGER);
  };

  /**
   * Check if user is Department Manager or above
   * @returns boolean
   */
  const isDepartmentManager = (): boolean => {
    return hasRoleLevel(RoleLevel.DEPARTMENT_MANAGER);
  };

  /**
   * Check if user can manage another user based on hierarchy
   * @param targetUserRole - Role name of target user
   * @returns boolean
   */
  const canManageUser = (targetUserRole: string): boolean => {
    if (!user) return false;
    
    const roleHierarchy: Record<string, RoleLevel> = {
      admin: RoleLevel.ADMIN,
      hr_manager: RoleLevel.HR_MANAGER,
      department_manager: RoleLevel.DEPARTMENT_MANAGER,
      employee: RoleLevel.EMPLOYEE,
    };

    const userLevel = roleHierarchy[user.roleName || user.role];
    const targetLevel = roleHierarchy[targetUserRole];

    if (userLevel === undefined || targetLevel === undefined) return false;

    // Can only manage users at lower hierarchy level
    return userLevel < targetLevel;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRoleLevel,
    isAdmin,
    isHRManager,
    isDepartmentManager,
    canManageUser,
  };
}
