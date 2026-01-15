import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { CalenderIcon } from "../../icons";
import type { IAttendance, IEmployee, IDepartment } from "../../types";
import { formatDate } from "../../utils";
import { useAttendances } from "../../hooks/useAttendances";
import { useEmployees } from "../../hooks/useEmployees";
import { useDepartments } from "../../hooks/useDepartments";

export default function AttendanceList() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { attendances, loading: attendancesLoading, error: attendancesError, fetchAttendances } = useAttendances();
  const { employees, loading: employeesLoading } = useEmployees();
  const { departments, loading: departmentsLoading } = useDepartments();
  const [searchTerm, setSearchTerm] = useState('');

  const loading = attendancesLoading || employeesLoading || departmentsLoading;
  const error = attendancesError;

  useEffect(() => {
    fetchAttendances({ date: selectedDate });
  }, [selectedDate, fetchAttendances]);

  const getEmployeeName = (employeeId: string | IEmployee) => {
    if (typeof employeeId === 'object') return employeeId.fullName;
    const emp = employees.find(e => e._id === employeeId);
    return emp?.fullName || 'N/A';
  };

  const getDepartmentName = (employeeId: string | IEmployee) => {
    let empId: string;
    if (typeof employeeId === 'object') {
      empId = employeeId._id;
    } else {
      empId = employeeId;
    }
    const emp = employees.find(e => e._id === empId);
    if (!emp) return 'N/A';
    const deptId = typeof emp.departmentId === 'string' ? emp.departmentId : emp.departmentId._id;
    const dept = departments.find(d => d._id === deptId);
    return dept?.name || 'N/A';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge color="success">Có mặt</Badge>;
      case "late":
        return <Badge color="warning">Đi muộn</Badge>;
      case "absent":
        return <Badge color="error">Vắng mặt</Badge>;
      case "leave":
        return <Badge color="light">Nghỉ phép</Badge>;
      default:
        return <Badge color="light">{status}</Badge>;
    }
  };

  // Filter attendances based on search term
  const filteredAttendances = attendances.filter(attendance => {
    const searchLower = searchTerm.toLowerCase();
    const empName = getEmployeeName(attendance.employeeId).toLowerCase();
    const deptName = getDepartmentName(attendance.employeeId).toLowerCase();
    const empId = typeof attendance.employeeId === 'string' ? attendance.employeeId : attendance.employeeId._id;
    
    return (
      empName.includes(searchLower) ||
      deptName.includes(searchLower) ||
      empId.toLowerCase().includes(searchLower)
    );
  });

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
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500 p-3">
                <CalenderIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Có mặt</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {attendances.filter(a => a.status === 'present').length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-500 p-3">
                <CalenderIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Đi muộn</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {attendances.filter(a => a.status === 'late').length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-500 p-3">
                <CalenderIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Vắng mặt</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {attendances.filter(a => a.status === 'absent').length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500 p-3">
                <CalenderIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tổng số</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {attendances.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <ComponentCard title="Chi tiết chấm công">
          {/* Filters */}
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên, phòng ban..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <select className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <option value="">Tất cả phòng ban</option>
                <option value="IT">Phát triển phần mềm</option>
                <option value="HR">Nhân sự</option>
                <option value="Accounting">Kế toán</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                Xuất Excel
              </button>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                Chấm công thủ công
              </button>
            </div>
          </div>

          {/* Table */}
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
                      Trạng thái
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendances.length === 0 ? (
                    <TableRow>
                      <TableCell className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                        Không có dữ liệu chấm công cho ngày này
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAttendances.map((record) => (
                      <TableRow key={record._id} className="border-b border-gray-100 last:border-0 dark:border-white/[0.05]">
                        <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          #{(typeof record.employeeId === 'string' ? record.employeeId : record.employeeId._id).slice(-6).toUpperCase()}
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
                          {record.checkInTime || '-'}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {record.checkOutTime || '-'}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          -
                        </TableCell>
                        <TableCell className="px-5 py-4">
                          {getStatusBadge(record.status)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
