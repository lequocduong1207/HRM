import { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../api/employees.api';
import type { IEmployee, CreateEmployeeRequest } from '../types';
import { getErrorMessage } from '../utils';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await employeeService.getAllEmployees();
      setEmployees(response.data || response);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const createEmployee = useCallback(async (data: CreateEmployeeRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await employeeService.createEmployee(data);
      const newEmployee = response.data || response;
      setEmployees(prev => [...prev, newEmployee]);
      return { success: true, data: newEmployee };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEmployee = useCallback(async (id: string, data: Partial<CreateEmployeeRequest>) => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await employeeService.updateEmployee(id, data);
      const updatedEmployee = response.data || response;
      setEmployees(prev => prev.map(e => e._id === id ? updatedEmployee : e));
      return { success: true, data: updatedEmployee };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEmployee = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await employeeService.deleteEmployee(id);
      setEmployees(prev => prev.filter(e => e._id !== id));
      return { success: true };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
};
