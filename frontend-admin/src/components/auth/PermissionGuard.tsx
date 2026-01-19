/**
 * PermissionGuard Component
 * Conditional rendering dựa trên permissions
 */

import { ReactNode } from 'react';
import { usePermission } from '../../hooks/usePermission';
import { Permission } from '../../types/rbac.types';

interface PermissionGuardProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean; // true = AND logic, false = OR logic
  fallback?: ReactNode;
}

/**
 * Component để show/hide UI elements dựa trên permissions
 * 
 * @example
 * // Single permission
 * <PermissionGuard permission="employee:create">
 *   <CreateEmployeeButton />
 * </PermissionGuard>
 * 
 * @example
 * // Multiple permissions (OR logic)
 * <PermissionGuard permissions={["employee:read:all", "employee:read:dept"]}>
 *   <EmployeeList />
 * </PermissionGuard>
 * 
 * @example
 * // Multiple permissions (AND logic)
 * <PermissionGuard permissions={["user:update", "user:delete"]} requireAll>
 *   <AdminPanel />
 * </PermissionGuard>
 */
export function PermissionGuard({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
