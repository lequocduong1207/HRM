import { useMemo } from 'react';
import { useEmployees } from './useEmployees';
import { useDepartments } from './useDepartments';
import { useSearch } from './useSearch';
import { useDeleteConfirmation } from './useDeleteConfirmation';
import type { IEmployee, IDepartment } from '../types';

/**
 * Custom hook for Employee List page logic
 * Tách toàn bộ logic ra khỏi UI component
 */
export const useEmployeeListLogic = () => {
  // Data hooks
  const { employees, loading: employeesLoading, error, deleteEmployee } = useEmployees();
  const { departments, loading: departmentsLoading, fetchDepartments } = useDepartments();

  // Helper function to get department name
  const getDepartmentName = (departmentId: string | IDepartment) => {
    const deptId = typeof departmentId === 'string' ? departmentId : departmentId?._id;
    const dept = (departments || []).find(d => d._id === deptId);
    return dept?.name || 'N/A';
  };

  // Search logic
  const { searchTerm, setSearchTerm, filteredData: filteredEmployees } = useSearch(
    employees,
    [
      'fullName',
      'email',
      'phone',
      'position',
      (employee: IEmployee) => getDepartmentName(employee.departmentId),
    ]
  );

  // Delete confirmation logic
  const deleteConfirmation = useDeleteConfirmation<IEmployee>();

  // Handle delete with error handling
  const handleDeleteEmployee = async () => {
    const result = await deleteConfirmation.handleDelete(async (employee) => {
      return await deleteEmployee(employee._id);
    });

    if (!result?.success && result?.message) {
      alert(`Lỗi: ${result.message}`);
    } else if (result?.success) {
      // Refresh departments để cập nhật số lượng nhân viên
      await fetchDepartments();
    }
  };

  // Loading state
  const loading = employeesLoading || departmentsLoading;

  // Memoized employee data with department names
  const employeesWithDepartments = useMemo(() => {
    return filteredEmployees.map(employee => ({
      ...employee,
      departmentName: getDepartmentName(employee.departmentId),
    }));
  }, [filteredEmployees, departments]);

  return {
    // Data
    employees: employeesWithDepartments,
    totalCount: employees.length,
    filteredCount: filteredEmployees.length,
    
    // Loading & Error
    loading,
    error,
    
    // Search
    searchTerm,
    setSearchTerm,
    
    // Delete
    deleteModal: {
      show: deleteConfirmation.showModal,
      item: deleteConfirmation.itemToDelete,
      isDeleting: deleteConfirmation.isDeleting,
      open: deleteConfirmation.openModal,
      close: deleteConfirmation.closeModal,
      confirm: handleDeleteEmployee,
    },
  };
};
