import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router';
import AppLayout from '../layout/AppLayout';

// Lazy load admin pages
const Home = lazy(() => import('../pages/Dashboard/Home'));
const EmployeeList = lazy(() => import('../pages/Employees/EmployeeList'));
const AddEmployee = lazy(() => import('../pages/Employees/AddEmployee'));
const EditEmployee = lazy(() => import('../pages/Employees/EditEmployee'));
const EmployeeDetail = lazy(() => import('../pages/Employees/EmployeeDetail'));
const DepartmentList = lazy(() => import('../pages/Employees/DepartmentList'));
const AttendanceList = lazy(() => import('../pages/Attendance/AttendanceList'));
const AttendanceHistory = lazy(() => import('../pages/Attendance/AttendanceHistory'));
const LeaveApproval = lazy(() => import('../pages/Leave/LeaveApproval'));
const EmployeeReport = lazy(() => import('../pages/Reports/EmployeeReport'));
const UserManagement = lazy(() => import('../pages/Settings/UserManagement'));

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
 * Admin Routes
 * For roles: admin, hr_manager, department_manager
 */
export const adminRoutes: RouteObject[] = [
  {
    path: 'admin',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: withSuspense(Home),
      },
      // Employee Management
      {
        path: 'employees',
        children: [
          {
            index: true,
            element: withSuspense(EmployeeList),
          },
          {
            path: 'add',
            element: withSuspense(AddEmployee),
          },
          {
            path: 'edit/:id',
            element: withSuspense(EditEmployee),
          },
          {
            path: ':id',
            element: withSuspense(EmployeeDetail),
          },
          {
            path: 'departments',
            element: withSuspense(DepartmentList),
          },
          {
            path: 'detail/:id',
            element: withSuspense(EmployeeDetail),
          }
        ],
      },
      // Attendance
      {
        path: 'attendance',
        children: [
          {
            index: true,
            element: withSuspense(AttendanceList),
          },
          {
            path: 'history',
            element: withSuspense(AttendanceHistory),
          },
        ],
      },
      // Leave Management
      {
        path: 'leave',
        children: [
          {
            path: 'approval',
            element: withSuspense(LeaveApproval),
          },
        ],
      },
      // Reports
      {
        path: 'reports',
        children: [
          {
            path: 'employees',
            element: withSuspense(EmployeeReport),
          },
        ],
      },
      // Settings
      {
        path: 'settings',
        children: [
          {
            path: 'users',
            element: withSuspense(UserManagement),
          },
        ],
      },
    ],
  },
];
