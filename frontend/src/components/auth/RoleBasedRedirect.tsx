import { Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';

/**
 * RoleBasedRedirect
 * Redirects user to appropriate dashboard based on their role
 */
export const RoleBasedRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Debug logging
  console.log('RoleBasedRedirect - User:', user);
  console.log('RoleBasedRedirect - User role:', user.role);
  console.log('RoleBasedRedirect - User roleName:', user.roleName);

  // Redirect based on role
  switch (user.role) {
    case 'admin':
    case 'hr_manager':
    case 'department_manager':
      return <Navigate to="/admin" replace />;
    
    case 'employee':
      return <Navigate to="/employee" replace />;
    
    default:
      return <Navigate to="/signin" replace />;
  }
};

export default RoleBasedRedirect;
