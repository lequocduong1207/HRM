import { useState, useCallback } from 'react';
import { attendanceService } from '../api/attendances.api';
import type { IAttendance, AttendanceFilterParams, CheckInRequest, CheckOutRequest } from '../types';
import { getErrorMessage } from '../utils';

export const useAttendances = () => {
  const [attendances, setAttendances] = useState<IAttendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendances = useCallback(async (params?: AttendanceFilterParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await attendanceService.getAllAttendances(params);
      setAttendances(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const checkIn = useCallback(async (data: CheckInRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newAttendance = await attendanceService.checkIn(data);
      setAttendances(prev => [...prev, newAttendance]);
      return { success: true, data: newAttendance };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const checkOut = useCallback(async (data: CheckOutRequest) => {
    try {
      setLoading(true);
      setError(null);
      const updatedAttendance = await attendanceService.checkOut(data);
      setAttendances(prev => prev.map(a => 
        a._id === updatedAttendance._id ? updatedAttendance : a
      ));
      return { success: true, data: updatedAttendance };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    attendances,
    loading,
    error,
    fetchAttendances,
    checkIn,
    checkOut,
  };
};
