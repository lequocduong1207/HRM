import { useEffect, useState } from 'react';
import { authAPI } from '../../../api/auth.api';
import { attendanceService } from '../../../api/attendances.api';
import { TimeIcon, CalenderIcon, ArrowUpIcon, BoxIcon, DollarLineIcon, ArrowDownIcon } from '../../../icons';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import type { IAttendance } from '../../../types';

export default function EmployeeDashboard() {
  const [salaryInfo, setSalaryInfo] = useState<any>(null);
  const [loadingSalary, setLoadingSalary] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayAttendance, setTodayAttendance] = useState<IAttendance | null>(null);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // TODO: Load real stats from API
  const stats = { presentDays: 0, totalDays: 0, totalWorkHours: 0, lateDays: 0, absentDays: 0 };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch profile with salary info
        const profileResponse = await authAPI.getProfile();
        if (profileResponse.success && profileResponse.data) {
          setSalaryInfo(profileResponse.data.employee);
        }
        
        // Fetch today's attendance
        await loadTodayAttendance();
        
        // TODO: Fetch attendance stats
        // setStats(...)
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoadingSalary(false);
      }
    };
    loadData();
  }, []);

  const loadTodayAttendance = async () => {
    try {
      setLoadingAttendance(true);
      const response = await attendanceService.getTodayAttendance() as any;
      setTodayAttendance(response?.data || null);
    } catch (err: any) {
      console.error('Error loading today attendance:', err);
    } finally {
      setLoadingAttendance(false);
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
      const attendanceData = response?.data || null;
      
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

  const statCards = [
    {
      icon: <CalenderIcon className="w-6 h-6" />,
      title: 'Ngày làm việc',
      value: stats?.presentDays || 0,
      subtitle: `Trong ${stats?.totalDays || 0} ngày`,
      color: 'bg-blue-500',
    },
    {
      icon: <TimeIcon className="w-6 h-6" />,
      title: 'Tổng giờ làm',
      value: `${stats?.totalWorkHours?.toFixed(1) || 0}h`,
      subtitle: 'Tháng này',
      color: 'bg-green-500',
    },
    {
      icon: <ArrowUpIcon className="w-6 h-6" />,
      title: 'Đi muộn',
      value: stats?.lateDays || 0,
      subtitle: 'Lần',
      color: 'bg-yellow-500',
    },
    {
      icon: <BoxIcon className="w-6 h-6" />,
      title: 'Vắng mặt',
      value: stats?.absentDays || 0,
      subtitle: 'Ngày',
      color: 'bg-red-500',
    },
  ];

  // Calculate salary data from employee info
  const basicSalary = salaryInfo?.salary || 0;
  const allowancesAmount = basicSalary * 0.25; // 25% phụ cấp
  const deductionsAmount = basicSalary * 0.105; // 10.5% khấu trừ (thuế + BHXH)
  const netSalary = basicSalary + allowancesAmount - deductionsAmount;

  // Calculate salary chart data based on basic salary
  const basicSalaryInMillions = basicSalary / 1000000;
  const allowancesInMillions = allowancesAmount / 1000000;
  const deductionsInMillions = deductionsAmount / 1000000;

  // Salary Chart Configuration
  const salaryChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 8,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
      labels: {
        style: {
          colors: '#9CA3AF',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Triệu đồng',
        style: {
          color: '#9CA3AF',
        },
      },
      labels: {
        style: {
          colors: '#9CA3AF',
        },
      },
    },
    fill: {
      opacity: 1,
      colors: ['#10B981', '#3B82F6', '#F59E0B'],
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} triệu đồng`,
      },
      theme: 'dark',
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: '#9CA3AF',
      },
    },
    grid: {
      borderColor: '#374151',
    },
  };

  const salaryChartSeries = [
    {
      name: 'Lương cơ bản',
      data: loadingSalary 
        ? [0, 0, 0, 0, 0, 0] 
        : [basicSalaryInMillions, basicSalaryInMillions, basicSalaryInMillions, basicSalaryInMillions, basicSalaryInMillions, basicSalaryInMillions],
    },
    {
      name: 'Phụ cấp & Thưởng',
      data: loadingSalary 
        ? [0, 0, 0, 0, 0, 0] 
        : [allowancesInMillions, allowancesInMillions, allowancesInMillions, allowancesInMillions, allowancesInMillions, allowancesInMillions],
    },
    {
      name: 'Khấu trừ',
      data: loadingSalary 
        ? [0, 0, 0, 0, 0, 0] 
        : [deductionsInMillions, deductionsInMillions, deductionsInMillions, deductionsInMillions, deductionsInMillions, deductionsInMillions],
    },
  ];

  // Attendance Chart Configuration
  const attendanceChartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
    },
    labels: ['Có mặt', 'Đi muộn', 'Vắng mặt', 'Còn lại'],
    colors: ['#3B82F6', '#F59E0B', '#EF4444', '#E5E7EB'],
    legend: {
      position: 'bottom',
      labels: {
        colors: '#9CA3AF',
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Tổng ngày',
              fontSize: '14px',
              color: '#9CA3AF',
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
      },
    },
    tooltip: {
      theme: 'dark',
    },
  };

  const attendanceChartSeries = [
    stats?.presentDays || 0,
    stats?.lateDays || 0,
    stats?.absentDays || 0,
    (stats?.totalDays || 0) - ((stats?.presentDays || 0) + (stats?.lateDays || 0) + (stats?.absentDays || 0)),
  ];

  return (
    <div className="space-y-6">
      {/* Quick Attendance Widget */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Time & Status */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <TimeIcon className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">
                  {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </h2>
                <p className="text-blue-100 text-sm">
                  {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {loadingAttendance ? (
              <div className="flex items-center gap-2 text-blue-100">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span className="text-sm">Đang tải trạng thái...</span>
              </div>
            ) : todayAttendance ? (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-blue-100 text-xs mb-1">Giờ vào</p>
                  <p className="text-xl font-bold">
                    {todayAttendance.checkIn ? new Date(todayAttendance.checkIn).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </p>
                  {todayAttendance.isLate && (
                    <p className="text-xs text-yellow-300 mt-1">⚠️ Đi muộn</p>
                  )}
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-blue-100 text-xs mb-1">Giờ ra</p>
                  <p className="text-xl font-bold">
                    {todayAttendance.checkOut ? new Date(todayAttendance.checkOut).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </p>
                  {todayAttendance.isEarlyLeave && (
                    <p className="text-xs text-yellow-300 mt-1">⚠️ Về sớm</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-blue-100 text-sm mt-2">Chưa chấm công hôm nay</p>
            )}
          </div>

          {/* Right: Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {error && (
              <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm mb-2">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm mb-2">
                {success}
              </div>
            )}
            
            <button
              onClick={handleCheckIn}
              disabled={actionLoading || loadingAttendance || (todayAttendance?.checkIn !== undefined && todayAttendance?.checkIn !== null)}
              className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100 min-w-[140px]"
            >
              {actionLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  Xử lý...
                </span>
              ) : todayAttendance?.checkIn ? (
                '✓ Đã chấm vào'
              ) : (
                '→ Chấm công vào'
              )}
            </button>

            <button
              onClick={handleCheckOut}
              disabled={actionLoading || loadingAttendance || !todayAttendance?.checkIn || (todayAttendance?.checkOut !== undefined && todayAttendance?.checkOut !== null)}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 disabled:bg-white/10 disabled:text-white/50 disabled:cursor-not-allowed rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100 min-w-[140px]"
            >
              {actionLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Xử lý...
                </span>
              ) : todayAttendance?.checkOut ? (
                '✓ Đã chấm ra'
              ) : (
                '← Chấm công ra'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Salary Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <DollarLineIcon className="w-6 h-6 text-emerald-600" />
          Thống kê lương tháng này
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Summary Section */}
          <div className="space-y-4">
            {/* Main Salary Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-emerald-100 text-sm font-medium">Tổng thu nhập</p>
                <BoxIcon className="w-6 h-6 text-emerald-100" />
              </div>
              <p className="text-4xl font-bold mb-1">
                {loadingSalary ? 'Đang tải...' : `${Math.round(netSalary).toLocaleString('vi-VN')}đ`}
              </p>
              <div className="flex items-center gap-2 text-emerald-100 text-sm">
                <span>Lương tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}</span>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                    <DollarLineIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Lương cơ bản</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Theo hợp đồng</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {loadingSalary ? '...' : `${basicSalary.toLocaleString('vi-VN')}đ`}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                    <BoxIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Phụ cấp & Thưởng</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Tháng này</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {loadingSalary ? '...' : `+${Math.round(allowancesAmount).toLocaleString('vi-VN')}đ`}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                    <ArrowDownIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Khấu trừ</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Thuế & Bảo hiểm (10.5%)</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {loadingSalary ? '...' : `-${Math.round(deductionsAmount).toLocaleString('vi-VN')}đ`}
                </p>
              </div>
            </div>
          </div>

          {/* Right Chart Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Xu hướng lương 6 tháng
            </h3>
            <ReactApexChart
              options={salaryChartOptions}
              series={salaryChartSeries}
              type="bar"
              height={340}
            />
          </div>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Thống kê chấm công
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Stats Section */}
          <div className="space-y-3">
            {statCards.map((card, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center gap-3">
                  <div className={`${card.color} p-3 rounded-lg text-white`}>
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{card.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{card.subtitle}</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {/* Right Chart Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Phân bổ chấm công tháng này
            </h3>
            <ReactApexChart
              options={attendanceChartOptions}
              series={attendanceChartSeries}
              type="donut"
              height={340}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
