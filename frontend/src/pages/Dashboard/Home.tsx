import { useEffect, useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import { useEmployees } from "../../hooks/useEmployees";
import { useDepartments } from "../../hooks/useDepartments";
import { useAttendances } from "../../hooks/useAttendances";
import { auditService, type IAuditLog } from "../../api/audit.api";
import Chart from 'react-apexcharts';

export default function Home() {
  const { employees, loading: employeesLoading } = useEmployees();
  const { departments, loading: departmentsLoading } = useDepartments();
  const { attendances, loading: attendancesLoading, fetchAttendances } = useAttendances();
  const [recentActivities, setRecentActivities] = useState<IAuditLog[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);

  // Date range states
  const [attendanceDays, setAttendanceDays] = useState(7);

  useEffect(() => {
    // Fetch attendance data based on selected days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (attendanceDays - 1));
    
    fetchAttendances({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  }, [fetchAttendances, attendanceDays]);

  useEffect(() => {
    // Fetch recent activities from audit logs
    const fetchActivities = async () => {
      setActivitiesLoading(true);
      try {
        const response = await auditService.getRecentLogs({ limit: 10 });
        
        if (response.success && response.data) {
          setRecentActivities(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setActivitiesLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Department statistics
  const departmentStats = useMemo(() => {
    if (!employees || !departments) return { labels: [], data: [] };
    
    const activeDepts = departments.filter(d => !d.isDeleted);
    const stats = activeDepts.map(dept => {
      const count = employees.filter(emp => {
        const deptId = typeof emp.departmentId === 'string' ? emp.departmentId : emp.departmentId?._id;
        return deptId === dept._id;
      }).length;
      return { name: dept.name, count };
    });

    return {
      labels: stats.map(s => s.name),
      data: stats.map(s => s.count)
    };
  }, [employees, departments]);

  // Gender statistics
  const genderStats = useMemo(() => {
    if (!employees) return { labels: [], data: [] };
    
    const male = employees.filter(e => e.gender === 'Nam').length;
    const female = employees.filter(e => e.gender === 'Nữ').length;
    const other = employees.filter(e => e.gender === 'Khác' || !e.gender).length;

    return {
      labels: ['Nam', 'Nữ', 'Khác'],
      data: [male, female, other]
    };
  }, [employees]);

  // Attendance trend (dynamic days)
  const attendanceTrend = useMemo(() => {
    if (!attendances) return { labels: [], data: [] };
    
    const days = [];
    for (let i = attendanceDays - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }

    const trend = days.map(date => {
      const count = attendances.filter(a => {
        const aDate = new Date(a.date).toISOString().split('T')[0];
        return aDate === date;
      }).length;
      return count;
    });

    return {
      labels: days.map(d => {
        const date = new Date(d);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }),
      data: trend
    };
  }, [attendances, attendanceDays]);

  // Charts Options
  const departmentChartOptions: any = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      background: 'transparent',
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { 
      curve: 'smooth', 
      width: 3 
    },
    markers: {
      size: 5,
      colors: ['#3b82f6'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: { size: 7 }
    },
    xaxis: {
      categories: departmentStats.labels,
      labels: {
        style: { colors: '#64748b' }
      }
    },
    yaxis: {
      title: { text: 'Số nhân viên' },
      labels: {
        style: { colors: '#64748b' }
      }
    },
    colors: ['#3b82f6'],
    tooltip: {
      y: {
        formatter: (val: number) => `${val} nhân viên`
      }
    },
    theme: { mode: 'light' }
  };

  const genderChartOptions: any = {
    chart: {
      type: 'pie',
      background: 'transparent'
    },
    labels: genderStats.labels,
    colors: ['#3b82f6', '#ec4899', '#a855f7'],
    legend: {
      position: 'bottom',
      labels: { colors: '#64748b' }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} người`
      }
    },
    theme: { mode: 'light' }
  };

  const attendanceChartOptions: any = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 8,
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: attendanceTrend.labels,
      labels: {
        style: { colors: '#64748b' }
      }
    },
    yaxis: {
      title: { text: 'Số lượt chấm công' },
      labels: {
        style: { colors: '#64748b' }
      }
    },
    fill: { 
      opacity: 1, 
      colors: ['#10b981']
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} lượt`
      }
    },
    theme: { mode: 'light' }
  };

  // Format action text for display
  const formatAction = (action: string) => {
    const actionMap: { [key: string]: string } = {
      'USER_LOGIN': 'Đăng nhập',
      'USER_LOGOUT': 'Đăng xuất',
      'EMPLOYEE_CREATED': 'Thêm nhân viên',
      'EMPLOYEE_UPDATED': 'Cập nhật nhân viên',
      'EMPLOYEE_DELETED': 'Xóa nhân viên',
      'DEPARTMENT_CREATED': 'Thêm phòng ban',
      'DEPARTMENT_UPDATED': 'Cập nhật phòng ban',
      'LEAVE_APPROVED': 'Duyệt đơn nghỉ phép',
      'LEAVE_REJECTED': 'Từ chối đơn nghỉ phép',
      'ATTENDANCE_CREATED': 'Chấm công'
    };
    return actionMap[action] || action;
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const loading = employeesLoading || departmentsLoading || attendancesLoading;

  return (
    <>
      <PageMeta
        title="HRM Dashboard | Quản lý Nhân sự"
        description="Trang quản trị hệ thống quản lý nhân sự"
      />

      {/* Charts Section */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 mb-6">
        {/* Department Line Chart */}
        <div className="col-span-12 xl:col-span-8">
          <ComponentCard 
            title="Thống kê nhân viên theo phòng ban"
            desc="Phân bố nhân viên trong các phòng ban"
          >
            {loading ? (
              <div className="flex items-center justify-center h-80">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Chart
                options={departmentChartOptions}
                series={[{ name: 'Nhân viên', data: departmentStats.data }]}
                type="line"
                height={320}
              />
            )}
          </ComponentCard>
        </div>

        {/* Gender Pie Chart */}
        <div className="col-span-12 xl:col-span-4">
          <ComponentCard 
            title="Thống kê giới tính"
            desc="Phân bố giới tính nhân viên"
          >
            {loading ? (
              <div className="flex items-center justify-center h-80">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Chart
                options={genderChartOptions}
                series={genderStats.data}
                type="pie"
                height={320}
              />
            )}
          </ComponentCard>
        </div>
      </div>

      {/* Attendance Trend and Recent Activities */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 mb-6">
        {/* Attendance Trend Bar Chart */}
        <div className="col-span-12 xl:col-span-8">
          <ComponentCard 
            title="Xu hướng chấm công"
            desc="Số lượt chấm công theo ngày"
          >
            <div className="mb-4 flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Khoảng thời gian:
              </label>
              <select
                value={attendanceDays}
                onChange={(e) => setAttendanceDays(Number(e.target.value))}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value={7}>7 ngày qua</option>
                <option value={14}>14 ngày qua</option>
                <option value={30}>30 ngày qua</option>
                <option value={60}>60 ngày qua</option>
                <option value={90}>90 ngày qua</option>
              </select>
            </div>
            {loading ? (
              <div className="flex items-center justify-center h-80">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Chart
                options={attendanceChartOptions}
                series={[{ name: 'Chấm công', data: attendanceTrend.data }]}
                type="bar"
                height={320}
              />
            )}
          </ComponentCard>
        </div>

        {/* Recent Activities */}
        <div className="col-span-12 xl:col-span-4">
          <ComponentCard 
            title="Hoạt động gần đây"
            desc="Các thao tác mới nhất trong hệ thống"
          >
            {activitiesLoading ? (
              <div className="flex items-center justify-center h-80">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">Chưa có hoạt động nào</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentActivities.map((activity) => (
                  <div
                    key={activity._id}
                    className="flex items-start gap-3 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {formatAction(activity.action)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {typeof activity.userId === 'object' ? activity.userId?.fullName : 'Hệ thống'}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {formatRelativeTime(activity.timestamp || activity.createdAt || '')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ComponentCard>
        </div>
      </div>
    </>
  );
}
