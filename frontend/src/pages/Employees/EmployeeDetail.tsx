import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
import Badge from "../../components/ui/badge/Badge";
import { employeeService } from "../../api/employees.api";
import { attendanceService } from "../../api/attendances.api";
import { userService } from "../../api/users.api";
import { formatDate, formatCurrency, getErrorMessage } from "../../utils";
import type { IEmployee, IAttendance, UserRole } from "../../types";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * Employee Detail Page - Chi tiết thông tin nhân viên
 */
export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<IEmployee | null>(null);
  const [attendances, setAttendances] = useState<IAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'salary' | 'attendance' | 'violations'>('info');
  
  // States for create account modal
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [accountData, setAccountData] = useState({
    password: '',
    confirmPassword: '',
    role: 'employee' as UserRole
  });
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountSuccess, setAccountSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch employee details
        const response = await employeeService.getEmployeeById(id);
        // Handle both direct data and wrapped response
        const employeeData = (response as any)?.data || response;
        setEmployee(employeeData);
        
        // Fetch attendance history (last 30 days)
        try {
          const endDate = new Date();
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 30);
          
          const attendanceData = await attendanceService.getAttendanceHistory({
            employeeId: id,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
          });
          // Ensure attendanceData is an array
          setAttendances(Array.isArray(attendanceData) ? attendanceData : []);
        } catch (err) {
          console.error('Error fetching attendance:', err);
          setAttendances([]); // Set empty array on error
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Không thể tải thông tin nhân viên');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCreateAccount = async () => {
    setAccountError(null);
    setAccountSuccess(false);

    // Validate
    if (!accountData.password || !accountData.confirmPassword) {
      setAccountError('Vui lòng nhập mật khẩu');
      return;
    }
    if (accountData.password !== accountData.confirmPassword) {
      setAccountError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (accountData.password.length < 6) {
      setAccountError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setCreatingAccount(true);
      await userService.createUser({
        email: employee!.email,
        password: accountData.password,
        fullName: employee!.fullName,
        role: accountData.role,
        employeeId: employee!._id
      });
      
      setAccountSuccess(true);
      setTimeout(() => {
        setShowCreateAccountModal(false);
        setAccountData({ password: '', confirmPassword: '', role: 'employee' });
        // Reload page to reflect changes
        window.location.reload();
      }, 2000);
    } catch (err) {
      setAccountError(getErrorMessage(err));
    } finally {
      setCreatingAccount(false);
    }
  };

  if (loading) {
    return <LoadingState message="Đang tải thông tin nhân viên..." />;
  }

  if (error || !employee) {
    return <ErrorState message={error || 'Không tìm thấy nhân viên'} />;
  }

  // Tính toán các thống kê
  const totalWorkDays = attendances.length;
  const lateDays = attendances.filter(a => a.isLate).length;
  const earlyLeaveDays = attendances.filter(a => a.isEarlyLeave).length;
  const violations = lateDays + earlyLeaveDays;
  
  // Dữ liệu lương giả định (6 tháng gần nhất)
  const salaryHistory = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      month: date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' }),
      amount: employee.salary + (Math.random() * 2000000 - 1000000), // Biến động ngẫu nhiên
    };
  }).reverse();

  const avgSalary = salaryHistory.reduce((sum, s) => sum + s.amount, 0) / salaryHistory.length;
  const maxSalary = Math.max(...salaryHistory.map(s => s.amount));
  const departmentName = typeof employee.departmentId === 'object' && employee.departmentId 
    ? employee.departmentId.name 
    : 'Chưa phân công';
  
  // Tính thâm niên (số năm làm việc)
  const calculateSeniority = (hireDate: string | Date) => {
    const hire = new Date(hireDate);
    const now = new Date();
    
    // Nếu ngày vào làm ở tương lai, trả về 0
    if (hire > now) {
      return 'Chưa bắt đầu';
    }
    
    const years = now.getFullYear() - hire.getFullYear();
    const months = now.getMonth() - hire.getMonth();
    const days = now.getDate() - hire.getDate();
    
    // Tính tổng số tháng chính xác
    let totalMonths = years * 12 + months;
    if (days < 0) {
      totalMonths -= 1;
    }
    
    // Đảm bảo totalMonths không âm
    if (totalMonths < 0) {
      totalMonths = 0;
    }
    
    if (totalMonths === 0) {
      return 'Dưới 1 tháng';
    }
    
    if (totalMonths < 12) {
      return `${totalMonths} tháng`;
    }
    
    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    return m > 0 ? `${y} năm ${m} tháng` : `${y} năm`;
  };
  const seniority = calculateSeniority(employee.hireDate);

  return (
    <>
      <PageMeta
        title={`Chi tiết nhân viên: ${employee.fullName} | HRM System`}
        description={`Thông tin chi tiết về nhân viên ${employee.fullName}`}
      />
      <PageBreadcrumb pageTitle="Chi tiết nhân viên" />

      <div className="space-y-6">
        {/* Header với thông tin cơ bản */}
        <ComponentCard title="Thông tin nhân viên">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                {employee.fullName?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Thông tin cơ bản */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {employee.fullName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {employee.position} • {departmentName}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge color={employee.isActive ? "success" : "error"}>
                    {employee.isActive ? "Đang làm việc" : "Ngừng làm việc"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mã nhân viên</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    #{employee._id ? employee._id.slice(-6).toUpperCase() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {employee.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Số điện thoại</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {employee.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ngày vào làm</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {formatDate(employee.hireDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Thâm niên</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {seniority}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/admin/employees/edit/${employee._id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm text-center"
                >
                  Chỉnh sửa thông tin
                </Link>
                {!employee.userId && (
                  <button
                    onClick={() => setShowCreateAccountModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    + Tạo tài khoản đăng nhập
                  </button>
                )}
                <button
                  onClick={() => navigate('/admin/employees')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
                >
                  Quay lại
                </button>
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* Menu Tabs */}
        <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 min-w-[80px] px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'info'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Thông tin cá nhân</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('salary')}
              className={`flex-1 min-w-[80px] px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'salary'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">Lương & Thưởng</span>
                <span className="hidden md:inline px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                  {formatCurrency(employee.salary)}
                </span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex-1 min-w-[80px] px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'attendance'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline">Chấm công</span>
                <span className="hidden md:inline px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                  {totalWorkDays} ngày
                </span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('violations')}
              className={`flex-1 min-w-[80px] px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'violations'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="hidden sm:inline">Vi phạm</span>
                {violations > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
                    {violations}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <ComponentCard title="Thông tin cá nhân chi tiết">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Giới tính</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
                    {employee.gender || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ngày sinh</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
                    {employee.dob ? formatDate(employee.dob) : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">CMND/CCCD</p>
                <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
                  {employee.nationalId || 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Địa chỉ</p>
                <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
                  {employee.address || 'N/A'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày tạo hồ sơ</p>
                <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
                  {formatDate(employee.createdAt)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cập nhật lần cuối</p>
                <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
                  {formatDate(employee.updatedAt)}
                </p>
              </div>
            </div>
          </ComponentCard>
        )}

        {activeTab === 'salary' && (
          <ComponentCard title="Lịch sử lương (6 tháng gần nhất)">
            <div className="space-y-6">
              {/* Thống kê tóm tắt */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lương hiện tại</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                    {formatCurrency(employee.salary)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lương trung bình</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {formatCurrency(avgSalary)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lương cao nhất</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                    {formatCurrency(maxSalary)}
                  </p>
                </div>
              </div>

              {/* Biểu đồ Recharts */}
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={salaryHistory}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6B7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip 
                      content={({ active, payload }: any) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {payload[0].payload.month}
                              </p>
                              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                {formatCurrency(payload[0].value as number)}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorAmount)"
                      dot={{ r: 5, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 7 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ComponentCard>
        )}

        {activeTab === 'attendance' && (
          <ComponentCard title="Lịch sử chấm công (30 ngày gần nhất)">
            {attendances.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Chưa có dữ liệu chấm công
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Lịch dạng grid */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 min-w-[280px]">
                  {/* Header - Thứ */}
                  {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                    <div key={day} className="text-center py-2 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {day}
                    </div>
                  ))}
                  
                  {/* Tạo mảng 30 ngày gần nhất */}
                  {Array.from({ length: 30 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (29 - i));
                    const dateStr = date.toISOString().split('T')[0];
                    const attendance = attendances.find(a => {
                      const aDate = new Date(a.date);
                      return aDate.toISOString().split('T')[0] === dateStr;
                    });
                    const dayOfWeek = date.getDay();
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                    
                    return (
                      <div
                        key={i}
                        className={`relative p-1 sm:p-2 md:p-3 rounded-lg border-2 transition-all ${
                          attendance
                            ? attendance.isLate || attendance.isEarlyLeave
                              ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
                              : 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                            : isWeekend
                            ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            : 'bg-white dark:bg-white/[0.02] border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white">
                            {date.getDate()}
                          </div>
                          {attendance ? (
                            <>
                              <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {attendance.checkIn ? new Date(attendance.checkIn).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {attendance.checkOut ? new Date(attendance.checkOut).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                              </div>
                              {(attendance.isLate || attendance.isEarlyLeave) && (
                                <div className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                              )}
                            </>
                          ) : (
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {isWeekend ? 'Nghỉ' : 'Trống'}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chú thích */}
                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-200 dark:bg-green-900/40 border-2 border-green-400 dark:border-green-600 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-400">Đúng giờ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-200 dark:bg-orange-900/40 border-2 border-orange-400 dark:border-orange-600 rounded relative">
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">Có vi phạm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-400">Nghỉ / Chưa chấm công</span>
                  </div>
                </div>
              </div>
            )}
          </ComponentCard>
        )}

        {activeTab === 'violations' && (
          <ComponentCard title="Thống kê vi phạm">
            {violations === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Không có vi phạm
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Nhân viên không có vi phạm nào trong 30 ngày qua
                </p>
              </div>
            ) : (
              <div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
                  <div className="flex gap-3">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                      <h4 className="text-red-800 dark:text-red-300 font-medium mb-2">
                        Phát hiện {violations} lần vi phạm trong 30 ngày qua
                      </h4>
                      <ul className="space-y-1 text-sm text-red-700 dark:text-red-400">
                        {lateDays > 0 && <li>• Đi muộn: {lateDays} lần</li>}
                        {earlyLeaveDays > 0 && <li>• Về sớm: {earlyLeaveDays} lần</li>}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-full">
                        <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Đi muộn</p>
                        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{lateDays}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">lần trong 30 ngày</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-full">
                        <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Về sớm</p>
                        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{earlyLeaveDays}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">lần trong 30 ngày</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ComponentCard>
        )}
      </div>

      {/* Modal Tạo tài khoản */}
      {showCreateAccountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Tạo tài khoản đăng nhập
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Tạo tài khoản đăng nhập cho nhân viên <strong>{employee.fullName}</strong>
            </p>

            {accountError && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {accountError}
              </div>
            )}

            {accountSuccess && (
              <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm">
                ✓ Tạo tài khoản thành công!
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={employee.email}
                  disabled
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vai trò <span className="text-red-500">*</span>
                </label>
                <select
                  value={accountData.role}
                  onChange={(e) => setAccountData({...accountData, role: e.target.value as UserRole})}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="employee">Nhân viên</option>
                  <option value="department_manager">Quản lý Phòng ban</option>
                  <option value="hr_manager">Quản lý HR</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={accountData.password}
                  onChange={(e) => setAccountData({...accountData, password: e.target.value})}
                  placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={accountData.confirmPassword}
                  onChange={(e) => setAccountData({...accountData, confirmPassword: e.target.value})}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateAccount}
                disabled={creatingAccount}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {creatingAccount ? 'Đang tạo...' : 'Tạo tài khoản'}
              </button>
              <button
                onClick={() => {
                  setShowCreateAccountModal(false);
                  setAccountData({ password: '', confirmPassword: '', role: 'employee' });
                  setAccountError(null);
                  setAccountSuccess(false);
                }}
                disabled={creatingAccount}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
