/**
 * Permission-based UI Components Examples
 * Các ví dụ sử dụng RBAC trong React components
 */

import { PermissionGuard } from '../../components/auth/PermissionGuard';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { usePermission } from '../../hooks/usePermission';
import { PERMISSIONS, RoleLevel } from '../../types/rbac.types';
import { useAuth } from '../../context/AuthContext';

/**
 * Example 1: Conditional Button Rendering
 */
export function EmployeeManagementExample() {
  const { hasPermission, isAdmin } = usePermission();

  return (
    <div>
      <h2>Employee Management</h2>
      
      {/* Show Create button only if user has permission */}
      <PermissionGuard permission={PERMISSIONS.EMPLOYEE.CREATE}>
        <button>Create Employee</button>
      </PermissionGuard>

      {/* Show Delete button only for Admin */}
      <RoleGuard minLevel={RoleLevel.ADMIN}>
        <button className="danger">Delete Employee</button>
      </RoleGuard>

      {/* Conditional rendering using hook */}
      {hasPermission(PERMISSIONS.EMPLOYEE.UPDATE) && (
        <button>Edit Employee</button>
      )}

      {isAdmin() && (
        <button>Admin Actions</button>
      )}
    </div>
  );
}

/**
 * Example 2: Multiple Permissions (OR logic)
 */
export function EmployeeListExample() {
  return (
    <div>
      {/* Show list if user can read all OR read department */}
      <PermissionGuard 
        permissions={[
          PERMISSIONS.EMPLOYEE.READ_ALL,
          PERMISSIONS.EMPLOYEE.READ_DEPT
        ]}
      >
        <EmployeeList />
      </PermissionGuard>
    </div>
  );
}

function EmployeeList() {
  return <div>Employee List Component</div>;
}

/**
 * Example 3: Multiple Permissions (AND logic)
 */
export function AdminPanelExample() {
  return (
    <div>
      {/* Show panel only if user has BOTH permissions */}
      <PermissionGuard 
        permissions={[
          PERMISSIONS.USER.CREATE,
          PERMISSIONS.USER.DELETE
        ]}
        requireAll
      >
        <AdminPanel />
      </PermissionGuard>
    </div>
  );
}

function AdminPanel() {
  return <div>Admin Panel Component</div>;
}

/**
 * Example 4: Role-based Menu Items
 */
export function NavigationMenuExample() {
  const { hasAnyPermission, isHRManager } = usePermission();

  return (
    <nav>
      <ul>
        {/* Always visible */}
        <li><a href="/dashboard">Dashboard</a></li>

        {/* Only for users who can manage employees */}
        {hasAnyPermission([
          PERMISSIONS.EMPLOYEE.CREATE,
          PERMISSIONS.EMPLOYEE.UPDATE,
          PERMISSIONS.EMPLOYEE.DELETE
        ]) && (
          <li><a href="/employees">Employees</a></li>
        )}

        {/* Only for HR Manager and above */}
        {isHRManager() && (
          <li><a href="/reports">Reports</a></li>
        )}

        {/* Using RoleGuard component */}
        <RoleGuard minLevel={RoleLevel.ADMIN}>
          <li><a href="/settings">Settings</a></li>
        </RoleGuard>
      </ul>
    </nav>
  );
}

/**
 * Example 5: Table Actions based on Permissions
 */
export function EmployeeTableRowExample({ employee }: { employee: any }) {
  const { hasPermission, canManageUser } = usePermission();

  return (
    <tr>
      <td>{employee.name}</td>
      <td>{employee.email}</td>
      <td>
        {/* View action - always visible if has read permission */}
        <PermissionGuard 
          permissions={[
            PERMISSIONS.EMPLOYEE.READ_ALL,
            PERMISSIONS.EMPLOYEE.READ_DEPT
          ]}
        >
          <button>View</button>
        </PermissionGuard>

        {/* Edit action - only if can update */}
        {hasPermission(PERMISSIONS.EMPLOYEE.UPDATE) && (
          <button>Edit</button>
        )}

        {/* Delete action - only if can delete AND can manage this user's role */}
        {hasPermission(PERMISSIONS.EMPLOYEE.DELETE) && 
         canManageUser(employee.role) && (
          <button>Delete</button>
        )}
      </td>
    </tr>
  );
}

/**
 * Example 6: Fallback Content
 */
export function RestrictedContentExample() {
  return (
    <div>
      <PermissionGuard 
        permission={PERMISSIONS.SALARY.READ_ALL}
        fallback={
          <div className="alert alert-warning">
            You don't have permission to view salary information.
          </div>
        }
      >
        <SalaryReport />
      </PermissionGuard>
    </div>
  );
}

function SalaryReport() {
  return <div>Salary Report Component</div>;
}

/**
 * Example 7: Complex Conditional Logic
 */
export function ComplexPermissionExample({ department }: { department: any }) {
  const { hasPermission, hasAllPermissions, isAdmin } = usePermission();
  const { user } = useAuth();

  // Complex logic combining multiple checks
  const canEditDepartment = 
    isAdmin() || 
    (hasPermission(PERMISSIONS.DEPARTMENT.UPDATE) && user?.departmentId === department._id);

  const canAssignManager = 
    hasAllPermissions([
      PERMISSIONS.DEPARTMENT.ASSIGN_MANAGER,
      PERMISSIONS.USER.UPDATE
    ]);

  return (
    <div>
      <h3>{department.name}</h3>
      
      {canEditDepartment && (
        <button>Edit Department</button>
      )}

      {canAssignManager && (
        <button>Assign Manager</button>
      )}
    </div>
  );
}
