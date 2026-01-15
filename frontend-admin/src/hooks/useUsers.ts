import { useState, useEffect, useCallback } from 'react';
import { userService } from '../api/users.api';
import type { IUser, CreateUserRequest } from '../types';
import { getErrorMessage } from '../utils';

export const useUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = useCallback(async (data: CreateUserRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await userService.createUser(data);
      setUsers(prev => [...prev, newUser]);
      return { success: true, data: newUser };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, data: Partial<CreateUserRequest>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await userService.updateUser(id, data);
      setUsers(prev => prev.map(u => u._id === id ? updatedUser : u));
      return { success: true, data: updatedUser };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
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
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
