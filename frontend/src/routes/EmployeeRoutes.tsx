import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router';
import EmployeeLayout from '../layout/EmployeeLayout';

// Lazy load employee pages
const EmployeeDashboard = lazy(() => import('../features/employee/dashboard/EmployeeDashboard'));
const CheckIn = lazy(() => import('../features/employee/attendance/CheckIn'));
const MyHistory = lazy(() => import('../features/employee/attendance/MyHistory'));
const MyLeaves = lazy(() => import('../features/employee/leave/MyLeaves'));
const NewRequest = lazy(() => import('../features/employee/leave/NewRequest'));
const MyPayslips = lazy(() => import('../features/employee/payroll/MyPayslips'));
const MyProfile = lazy(() => import('../features/employee/profile/MyProfile'));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Wrap with Suspense
const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

/**
 * Employee Routes
 * For role: employee
 */
export const employeeRoutes: RouteObject[] = [
  {
    path: 'employee',
    element: <EmployeeLayout />,
    children: [
      {
        index: true,
        element: withSuspense(EmployeeDashboard),
      },
      {
        path: 'attendance/check-in',
        element: withSuspense(CheckIn),
      },
      {
        path: 'attendance/history',
        element: withSuspense(MyHistory),
      },
      {
        path: 'leave/my-leaves',
        element: withSuspense(MyLeaves),
      },
      {
        path: 'leave/new-request',
        element: withSuspense(NewRequest),
      },
      {
        path: 'payroll/payslips',
        element: withSuspense(MyPayslips),
      },
      {
        path: 'profile',
        element: withSuspense(MyProfile),
      },
    ],
  },
];
