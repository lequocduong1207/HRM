/**
 * RoleGuard Component
 * Conditional rendering dựa trên role hierarchy
 */

import { ReactNode } from 'react';
import { usePermission } from '../../hooks/usePermission';
import { RoleLevel, RoleName } from '../../types/rbac.types';

interface RoleGuardProps {
  children: ReactNode;
  minLevel?: RoleLevel;
  allowedRoles?: RoleName[];
  fallback?: ReactNode;
}

/**
 * Component để show/hide UI elements dựa trên role level
 * 
 * @example
 * // Minimum role level
 * <RoleGuard minLevel={RoleLevel.HR_MANAGER}>
 *   <AdminFeature />
 * </RoleGuard>
 * 
 * @example
 * // Specific roles only
 * <RoleGuard allowedRoles={["admin", "hr_manager"]}>
 *   <ManagementPanel />
 * </RoleGuard>
 */
export function RoleGuard({
  children,
  minLevel,
  allowedRoles,
  fallback = null,
}: RoleGuardProps) {
  const { hasRoleLevel } = usePermission();
  const { user } = useAuth();

  let hasAccess = false;

  if (minLevel !== undefined) {
    hasAccess = hasRoleLevel(minLevel);
  } else if (allowedRoles && user) {
    const userRole = user.roleName || user.role;
    hasAccess = allowedRoles.includes(userRole as RoleName);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Import useAuth
import { useAuth } from '../../context/AuthContext';
