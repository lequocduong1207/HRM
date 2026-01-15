import { useState, useEffect, useCallback } from 'react';
import { departmentService } from '../api/departments.api';
import type { IDepartment, CreateDepartmentRequest } from '../types';
import { getErrorMessage } from '../utils';

export const useDepartments = () => {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await departmentService.getAllDepartments();
      setDepartments(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const createDepartment = useCallback(async (data: CreateDepartmentRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newDepartment = await departmentService.createDepartment(data);
      setDepartments(prev => [...prev, newDepartment]);
      return { success: true, data: newDepartment };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDepartment = useCallback(async (id: string, data: Partial<CreateDepartmentRequest>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedDepartment = await departmentService.updateDepartment(id, data);
      setDepartments(prev => prev.map(d => d._id === id ? updatedDepartment : d));
      return { success: true, data: updatedDepartment };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDepartment = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await departmentService.deleteDepartment(id);
      // Soft delete: mark as deleted instead of removing from array
      setDepartments(prev => prev.map(d => 
        d._id === id ? { ...d, isDeleted: true, deletedAt: new Date().toISOString() } : d
      ));
      return { success: true };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const restoreDepartment = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const restoredDepartment = await departmentService.restoreDepartment(id);
      setDepartments(prev => prev.map(d => d._id === id ? restoredDepartment : d));
      return { success: true, data: restoredDepartment };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    departments,
    loading,
    error,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    restoreDepartment,
  };
};
