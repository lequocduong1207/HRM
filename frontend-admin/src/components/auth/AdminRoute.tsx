import { Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-4 border-gray-200 rounded-full border-t-brand-500 animate-spin"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập -> Redirect về signin
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Đã đăng nhập nhưng KHÔNG PHẢI ADMIN -> Hiển thị trang Access Denied
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
        <div className="max-w-md p-8 text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-error-50 dark:bg-error-500/10">
            <svg
              className="w-10 h-10 text-error-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
            Access Denied
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            You don't have permission to access this page. Only administrators can access the admin panel.
          </p>
          <button
            onClick={() => window.location.href = '/signin'}
            className="px-6 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 hover:bg-brand-600"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // Là ADMIN -> Cho vào
  return <>{children}</>;
}