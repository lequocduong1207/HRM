import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { EmptyState } from "../../components/common/EmptyState";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import type { IEmployee } from "../../types";
import { formatDate } from "../../utils";
import { useAttendances } from "../../hooks/useAttendances";
import { useEmployees } from "../../hooks/useEmployees";
import { useDepartments } from "../../hooks/useDepartments";
import * as XLSX from 'xlsx';

export default function AttendanceList() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);
  const { attendances, loading: attendancesLoading, error: attendancesError, fetchAttendances } = useAttendances();
  const { employees, loading: employeesLoading } = useEmployees();
  const { departments, loading: departmentsLoading } = useDepartments();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('all');

  const loading = attendancesLoading || employeesLoading || departmentsLoading;
  const error = attendancesError;

  useEffect(() => {
    fetchAttendances({ 
      startDate: selectedDate, 
      endDate: selectedDate 
    });
  }, [selectedDate, fetchAttendances]);

  const getEmployeeName = (employeeId: string | IEmployee) => {
    if (typeof employeeId === 'object') return employeeId?.fullName || 'N/A';
    const emp = employees?.find(e => e._id === employeeId);
    return emp?.fullName || 'N/A';
  };

  const getDepartmentName = (employeeId: string | IEmployee) => {
    let empId: string;
    if (typeof employeeId === 'object') {
      empId = employeeId?._id;
    } else {
      empId = employeeId;
    }
    if (!empId) return 'N/A';
    
    const emp = employees?.find(e => e._id === empId);
    if (!emp) return 'N/A';
    
    const deptId = typeof emp.departmentId === 'string' ? emp.departmentId : emp.departmentId?._id;
    if (!deptId) return 'N/A';
    
    const dept = departments?.find(d => d._id === deptId);
    return dept?.name || 'N/A';
  };

  const formatTime = (datetime?: string) => {
    if (!datetime) return '-';
    try {
      const date = new Date(datetime);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '-';
    }
  };

  const calculateWorkHours = (checkIn?: string, checkOut?: string) => {
    if (!checkIn || !checkOut) return '-';
    try {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-';
      
      const diff = end.getTime() - start.getTime();
      if (diff < 0) return '-'; // checkout before checkin
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } catch {
      return '-';
    }
  };

  const handlePreviousDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    const newDate = currentDate.toISOString().split('T')[0];
    setSelectedDate(newDate);
    setDateInput(newDate);
  };

  const handleNextDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    const newDate = currentDate.toISOString().split('T')[0];
    setSelectedDate(newDate);
    setDateInput(newDate);
  };

  const handleToday = () => {
    const newDate = new Date().toISOString().split('T')[0];
    setSelectedDate(newDate);
    setDateInput(newDate);
  };

  const handleDateBlur = () => {
    if (dateInput !== selectedDate) {
      setSelectedDate(dateInput);
    }
  };

  const handleDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (dateInput !== selectedDate) {
        setSelectedDate(dateInput);
      }
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleExportExcel = () => {
    if (!filteredAttendances || filteredAttendances.length === 0) {
      alert('Không có dữ liệu để xuất');
      return;
    }

    const exportData = filteredAttendances.map((record, index) => {
      const empId = typeof record.employeeId === 'string' 
        ? record.employeeId 
        : record.employeeId?._id || 'UNKNOWN';
      
      return {
        'STT': index + 1,
        'Mã NV': '#' + empId.slice(-6).toUpperCase(),
        'Họ và tên': getEmployeeName(record.employeeId),
        'Phòng ban': getDepartmentName(record.employeeId),
        'Ngày': formatDate(record.date),
        'Giờ vào': formatTime(record.checkIn),
        'Giờ ra': formatTime(record.checkOut),
        'Tổng giờ': calculateWorkHours(record.checkIn, record.checkOut),
        'Trạng thái': record.isLate ? 'Đi muộn' : record.isEarlyLeave ? 'Ra sớm' : 'Đúng giờ',
        'Ghi chú': record.notes || '-'
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Chấm công');
    
    // Auto-fit columns
    const maxWidth = exportData.reduce((w, r) => Math.max(w, r['Họ và tên'].length), 10);
    ws['!cols'] = [
      { wch: 5 },  // STT
      { wch: 12 }, // Mã NV
      { wch: maxWidth }, // Họ và tên
      { wch: 20 }, // Phòng ban
      { wch: 12 }, // Ngày
      { wch: 10 }, // Giờ vào
      { wch: 10 }, // Giờ ra
      { wch: 12 }, // Tổng giờ
      { wch: 12 }, // Trạng thái
      { wch: 20 }  // Ghi chú
    ];
    
    const fileName = `BangChamCong_${selectedDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Filter attendances based on search term and department
  const filteredAttendances = attendances?.filter(attendance => {
    if (!attendance?.employeeId) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const empName = getEmployeeName(attendance.employeeId).toLowerCase();
    const deptName = getDepartmentName(attendance.employeeId).toLowerCase();
    const empId = typeof attendance.employeeId === 'string' ? attendance.employeeId : attendance.employeeId?._id;
    
    const matchesSearch = (
      empName.includes(searchLower) ||
      deptName.includes(searchLower) ||
      (empId && empId.toLowerCase().includes(searchLower))
    );
    
    // Department filter
    let matchesDept = true;
    if (filterDept !== 'all') {
      const empIdStr = typeof attendance.employeeId === 'string' ? attendance.employeeId : attendance.employeeId?._id;
      const employee = employees?.find(e => e._id === empIdStr);
      if (employee) {
        const deptId = typeof employee.departmentId === 'string' ? employee.departmentId : employee.departmentId?._id;
        matchesDept = deptId === filterDept;
      } else {
        matchesDept = false;
      }
    }
    
    return matchesSearch && matchesDept;
  }) ?? [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu chấm công...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Lỗi: {error}</div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Bảng chấm công | HRM System"
        description="Quản lý chấm công nhân viên"
      />
      <PageBreadcrumb pageTitle="Bảng chấm công" />

      <div className="space-y-6">
        <ComponentCard title="Chi tiết chấm công">
          {/* Inline Summary - Modern & Context-aware */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {attendances?.length ?? 0}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                lượt chấm công · 
                {attendances?.filter(a => a.isLate).length ?? 0} đi muộn · 
                {attendances?.filter(a => a.isEarlyLeave).length ?? 0} ra sớm
              </span>
            </div>
            <div className="text-xs text-gray-400">
              {formatDate(selectedDate)}
            </div>
          </div>

          {/* Action-based Insights */}
          {(attendances && attendances.length > 0) && (
            <div className="mb-6 space-y-2">
              {attendances.filter(a => a.isLate).length > 0 && (
                <div className="flex items-center gap-3 rounded-lg bg-orange-50 px-4 py-2.5 text-sm dark:bg-orange-950/20">
                  <span className="text-orange-600 dark:text-orange-400">⚠️</span>
                  <span className="font-medium text-orange-900 dark:text-orange-300">
                    {attendances.filter(a => a.isLate).length} nhân viên đi muộn hôm nay
                  </span>
                  <button className="ml-auto text-xs text-orange-600 hover:underline dark:text-orange-400">
                    Xem chi tiết →
                  </button>
                </div>
              )}
              {attendances.filter(a => a.isEarlyLeave).length > 0 && (
                <div className="flex items-center gap-3 rounded-lg bg-red-50 px-4 py-2.5 text-sm dark:bg-red-950/20">
                  <span className="text-red-600 dark:text-red-400">⏰</span>
                  <span className="font-medium text-red-900 dark:text-red-300">
                    {attendances.filter(a => a.isEarlyLeave).length} nhân viên ra sớm
                  </span>
                </div>
              )}
              {attendances.filter(a => !a.isLate && !a.isEarlyLeave).length === attendances.length && (
                <div className="flex items-center gap-3 rounded-lg bg-green-50 px-4 py-2.5 text-sm dark:bg-green-950/20">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span className="font-medium text-green-900 dark:text-green-300">
                    Tất cả nhân viên đúng giờ
                  </span>
                </div>
              )}
            </div>
          )}
          {/* Filters - Compact & Modern */}
          <div className="mb-4 space-y-3">
            {/* Search and Department Filter */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-48 rounded-lg border-0 bg-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
              <select 
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="w-full sm:w-auto rounded-lg border-0 bg-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="all">Tất cả phòng ban</option>
                {departments?.filter(d => !d.isDeleted).map(dept => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
              
              <button 
                onClick={handleExportExcel}
                className="sm:ml-auto flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Xuất Excel
              </button>
            </div>

            {/* Date Navigation */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center gap-2 flex-1">
                <button
                  onClick={handlePreviousDay}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  title="Ngày trước"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  onBlur={handleDateBlur}
                  onKeyDown={handleDateKeyDown}
                  className="flex-1 rounded-lg border-0 bg-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  title="Nhập ngày và nhấn Enter hoặc click ra ngoài để tìm kiếm"
                />
                
                <button
                  onClick={handleNextDay}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  title="Ngày sau"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button
                  onClick={handleToday}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  Hôm nay
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          {filteredAttendances.length === 0 ? (
            <EmptyState
              title="Không có dữ liệu chấm công"
              description={searchTerm ? `Không tìm thấy dữ liệu chấm công khớp với "${searchTerm}"` : `Không có dữ liệu chấm công cho ngày ${formatDate(selectedDate)}`}
              icon={
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
          ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Mã NV
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Họ và tên
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Phòng ban
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Ngày
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Giờ vào
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Giờ ra
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Tổng giờ
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Ghi chú
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendances.map((record) => {
                    const empId = typeof record.employeeId === 'string' 
                      ? record.employeeId 
                      : record.employeeId?._id || 'UNKNOWN';
                    
                    return (
                    <TableRow key={record._id} className="border-b border-gray-100 last:border-0 dark:border-white/[0.05]">
                      <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        #{empId.slice(-6).toUpperCase()}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-900 dark:text-white">
                        {getEmployeeName(record.employeeId)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {getDepartmentName(record.employeeId)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(record.date)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <span>{formatTime(record.checkIn)}</span>
                          {record.isLate && (
                            <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                              Muộn
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <span>{formatTime(record.checkOut)}</span>
                          {record.isEarlyLeave && (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                              Sớm
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {calculateWorkHours(record.checkIn, record.checkOut)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {record.notes ? (
                          <span className="text-xs italic">{record.notes}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
