import { useState, useEffect } from 'react';
import { roleService } from '../api/roles.api';
import type { IRole } from '../types/role.types';

export const useRoles = (includeInactive = false, includeSystemRoles = true) => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await roleService.getAllRoles({
        includeInactive,
        includeSystemRoles,
      });
      if (response.success && response.data) {
        setRoles(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch roles');
      console.error('Error fetching roles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [includeInactive, includeSystemRoles]);

  return {
    roles,
    loading,
    error,
    refetch: fetchRoles,
  };
};
