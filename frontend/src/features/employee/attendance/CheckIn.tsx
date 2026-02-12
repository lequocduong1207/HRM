import { useEffect, useState } from 'react';
import { TimeIcon, CalenderIcon } from '../../../icons';
import { attendanceService } from '../../../api/attendances.api';
import type { IAttendance } from '../../../types';

export default function CheckIn() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayAttendance, setTodayAttendance] = useState<IAttendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadTodayAttendance();
  }, []);

  const loadTodayAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendanceService.getTodayAttendance() as any;
      setTodayAttendance(response.data || null);
    } catch (err: any) {
      console.error('Error loading today attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await attendanceService.checkIn({}) as any;
      
      // Update state with response data FIRST
      const attendanceData = response?.data?.data || response?.data || response;
      
      // Force update state immediately to disable buttons
      setTodayAttendance(prev => ({
        ...prev,
        ...attendanceData,
        checkIn: attendanceData.checkIn || new Date().toISOString()
      } as IAttendance));
      
      setSuccess('Chấm công vào thành công!');
      
      // Then reload to ensure fresh data from server
      setTimeout(() => loadTodayAttendance(), 500);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Check-in error:', err);
      setError(err?.response?.data?.message || 'Chấm công thất bại');
      setTimeout(() => setError(null), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await attendanceService.checkOut({}) as any;
      
      // Update state with response data FIRST
      const attendanceData = response?.data?.data || response?.data || response;
      
      // Force update state immediately to disable buttons
      setTodayAttendance(prev => ({
        ...prev,
        ...attendanceData,
        checkOut: attendanceData.checkOut || new Date().toISOString()
      } as IAttendance));
      
      setSuccess('Chấm công ra thành công!');
      
      // Then reload to ensure fresh data from server
      setTimeout(() => loadTodayAttendance(), 500);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Check-out error:', err);
      setError(err?.response?.data?.message || 'Chấm công thất bại');
      setTimeout(() => setError(null), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Chấm công
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{formatDate(currentTime)}</p>
      </div>

      {/* Current Time Display */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <TimeIcon className="w-8 h-8" />
          <span className="text-lg font-medium">Thời gian hiện tại</span>
        </div>
        <div className="text-6xl font-bold mb-2">{formatTime(currentTime)}</div>
      </div>

      {/* Attendance Status */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      ) : (
        <>
          {/* Alert Messages */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Current Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Trạng thái hôm nay</h2>
              <CalenderIcon className="w-6 h-6 text-gray-400" />
            </div>

            {todayAttendance ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Giờ vào</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {todayAttendance.checkIn ? new Date(todayAttendance.checkIn).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </p>
                    {todayAttendance.isLate && (
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">⚠️ Đi muộn</p>
                    )}
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Giờ ra</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {todayAttendance.checkOut ? new Date(todayAttendance.checkOut).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </p>
                    {todayAttendance.isEarlyLeave && (
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">⚠️ Về sớm</p>
                    )}
                  </div>
                </div>

                {(todayAttendance as any)?.workHours !== undefined && (todayAttendance as any)?.workHours !== null && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng giờ làm</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {(todayAttendance as any).workHours.toFixed(1)} giờ
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Chưa chấm công hôm nay</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleCheckIn}
              disabled={actionLoading || (todayAttendance?.checkIn !== undefined && todayAttendance?.checkIn !== null)}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-lg shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
            >
              {actionLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang xử lý...
                </span>
              ) : todayAttendance?.checkIn ? (
                '✓ Đã chấm công vào'
              ) : (
                '→ Chấm công vào'
              )}
            </button>

            <button
              onClick={handleCheckOut}
              disabled={actionLoading || !todayAttendance?.checkIn || (todayAttendance?.checkOut !== undefined && todayAttendance?.checkOut !== null)}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-lg shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
            >
              {actionLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang xử lý...
                </span>
              ) : todayAttendance?.checkOut ? (
                '✓ Đã chấm công ra'
              ) : (
                '← Chấm công ra'
              )}
            </button>
          </div>

          {/* Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 <strong>Lưu ý:</strong> Giờ làm chuẩn là 8:00 - 17:00. Đến sau 8:00 sẽ bị tính đi muộn, về trước 17:00 sẽ bị tính về sớm.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
