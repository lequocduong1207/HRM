import { useState, useEffect, useMemo } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";
import { useAttendances } from "../../hooks/useAttendances";
import type { IAttendance } from "../../types";

export default function AttendanceHistory() {
  const [dateRange, setDateRange] = useState(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6); // 6 tháng trước
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  });

  // Temporary filter state (chưa submit)
  const [tempDateRange, setTempDateRange] = useState(dateRange);

  const { attendances, loading, error, fetchAttendances } = useAttendances();

  useEffect(() => {
    fetchAttendances({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    });
  }, [dateRange, fetchAttendances]);

  const handleSubmitFilter = () => {
    setDateRange(tempDateRange);
  };

  // Tính toán thống kê
  const statistics = useMemo(() => {
    if (!attendances || attendances.length === 0) {
      return {
        totalDays: 0,
        totalLate: 0,
        totalEarlyLeave: 0,
        avgLatePerMonth: 0,
        attendanceRate: 0
      };
    }

    const totalDays = attendances.length;
    const totalLate = attendances.filter(a => a.isLate).length;
    const totalEarlyLeave = attendances.filter(a => a.isEarlyLeave).length;
    
    // Tính số tháng
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
    
    const avgLatePerMonth = monthsDiff > 0 ? (totalLate / monthsDiff) : 0;
    
    // Giả sử có 22 ngày làm việc/tháng
    const expectedDays = monthsDiff * 22;
    const attendanceRate = expectedDays > 0 ? (totalDays / expectedDays) * 100 : 0;

    return {
      totalDays,
      totalLate,
      totalEarlyLeave,
      avgLatePerMonth: avgLatePerMonth.toFixed(1),
      attendanceRate: attendanceRate.toFixed(1)
    };
  }, [attendances, dateRange]);

  // Nhóm dữ liệu theo tháng
  const monthlyData = useMemo(() => {
    if (!attendances || attendances.length === 0) return [];

    const grouped: { [key: string]: { total: number; late: number; earlyLeave: number } } = {};

    attendances.forEach((attendance: IAttendance) => {
      const date = new Date(attendance.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = { total: 0, late: 0, earlyLeave: 0 };
      }
      
      grouped[monthKey].total++;
      if (attendance.isLate) grouped[monthKey].late++;
      if (attendance.isEarlyLeave) grouped[monthKey].earlyLeave++;
    });

    // Chuyển thành array và sort theo tháng
    return Object.entries(grouped)
      .map(([monthKey, data]) => {
        const [year, month] = monthKey.split('-');
        return {
          monthKey,
          monthLabel: `Tháng ${parseInt(month)}/${year}`,
          ...data
        };
      })
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  }, [attendances]);

  if (loading) {
    return <LoadingState message="Đang tải lịch sử chấm công..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <>
      <PageMeta
        title="Lịch sử chấm công | HRM System"
        description="Xem lịch sử chấm công theo thời gian"
      />
      <PageBreadcrumb pageTitle="Lịch sử chấm công" />

      <div className="space-y-6">
        {/* Date Range Filter */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Từ ngày
              </label>
              <input
                type="date"
                value={tempDateRange.startDate}
                onChange={(e) => setTempDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full rounded-lg bg-gray-100 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Đến ngày
              </label>
              <input
                type="date"
                value={tempDateRange.endDate}
                onChange={(e) => setTempDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full rounded-lg bg-gray-100 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <button
              onClick={handleSubmitFilter}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed sm:whitespace-nowrap"
            >
              {loading ? 'Đang tải...' : 'Xem báo cáo'}
            </button>
          </div>
        </div>

        {/* Analytics Summary - Different from daily report */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Chart */}
          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Xu hướng chấm công</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">Phân tích theo tháng</p>
              </div>
              <div className="flex gap-3 sm:gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">Đúng giờ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-orange-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">Muộn</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">Sớm</span>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            {monthlyData.length > 0 ? (
              <div className="flex items-end justify-between gap-1.5 sm:gap-2 md:gap-3 h-40 sm:h-48 border-b border-gray-200 dark:border-gray-700 pb-1">
                {monthlyData.map((data) => {
                  const maxValue = Math.max(...monthlyData.map(d => d.total));
                  const heightPercent = (data.total / maxValue) * 100;
                  const latePercent = (data.late / data.total) * 100;
                  const earlyPercent = (data.earlyLeave / data.total) * 100;

                  return (
                    <div key={data.monthKey} className="flex-1 flex flex-col items-center gap-2 group">
                      <div 
                        className="w-full rounded-t flex flex-col overflow-hidden transition-opacity hover:opacity-80 cursor-pointer"
                        style={{ height: `${heightPercent}%` }}
                        title={`${data.monthLabel}: ${data.total} ngày`}
                      >
                        <div 
                          className="bg-red-500 w-full"
                          style={{ height: `${earlyPercent}%` }}
                        ></div>
                        <div 
                          className="bg-orange-500 w-full"
                          style={{ height: `${latePercent}%` }}
                        ></div>
                        <div 
                          className="bg-green-500 w-full flex-1"
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        {data.monthLabel.replace('Tháng ', '')}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400">
                Không có dữ liệu
              </div>
            )}
          </div>

          {/* Sidebar Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-4 sm:p-5 dark:border-gray-800 dark:from-blue-950/20 dark:to-white/[0.03]">
              <div className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-2">Tổng quan</div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1">{statistics.totalDays}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">ngày làm việc</div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs uppercase tracking-wide text-gray-500">Tỷ lệ muộn</div>
                <span className="text-xs font-medium text-orange-600">{statistics.totalDays > 0 ? ((statistics.totalLate / statistics.totalDays) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-orange-600 mb-1">{statistics.avgLatePerMonth}</div>
              <div className="text-xs text-gray-500">lần/tháng ({statistics.totalLate} tổng)</div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs uppercase tracking-wide text-gray-500">Ra sớm</div>
                <span className="text-xs font-medium text-red-600">{statistics.totalDays > 0 ? ((statistics.totalEarlyLeave / statistics.totalDays) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-red-600">{statistics.totalEarlyLeave}</div>
              <div className="text-xs text-gray-500">lần tổng cộng</div>
            </div>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <ComponentCard title="Chi tiết theo tháng">
          {monthlyData.length === 0 ? (
            <EmptyState
              title="Chưa có dữ liệu chấm công"
              description="Không có dữ liệu chấm công trong khoảng thời gian đã chọn"
              icon={
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
          ) : (
            <div className="space-y-3">
              {monthlyData.map((data) => {
                const totalDays = data.total;
                const onTimeDays = totalDays - data.late - data.earlyLeave;
                
                return (
                  <div
                    key={data.monthKey}
                    className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {data.monthLabel}
                      </h4>
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-600">
                          ✓ {onTimeDays} ngày đúng giờ
                        </span>
                        <span className="text-orange-600">
                          ⚠ {data.late} muộn
                        </span>
                        <span className="text-red-600">
                          ⏰ {data.earlyLeave} ra sớm
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{
                            width: `${totalDays > 0 ? (onTimeDays / totalDays) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
