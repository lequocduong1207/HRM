import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { PencilIcon, TrashBinIcon, EyeIcon } from "../../icons";
import { Link } from "react-router";
import { employeeService } from "../../api/employees.api";

interface Employee {
   employeeId: string;
    fullName: string;
    dob: Date | null;
    gender: "Male" | "Female" | "Other" | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    nationalId: string | null;         
    departmentId: number | null;
    position: string | null;
    hireDate: Date | null;
    employmentStatus: 'active' | 'inactive' | 'terminated' | 'resigned';
    createdAt: Date;
    updatedAt: Date;
}

export default function EmployeeList() {
  const formatDateVN = (date: Date) =>
  date ? new Date(date).toLocaleDateString('vi-VN') : '';


  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeService.getAllEmployees();
        // Đảm bảo dữ liệu đúng định dạng
        setEmployees(
          Array.isArray(data)
            ? data.map((item) => ({
                ...item,
                employeeId: item.employeeId?.toString() ?? "",
                fullName: item.fullName ?? "",
                dob: item.dob ? new Date(item.dob) : null,
                gender: item.gender ?? null,
                email: item.email ?? null,
                phone: item.phone ?? null,
                address: item.address ?? null,
                nationalId: item.nationalId ?? null,
                departmentId: item.departmentId ?? null,
                position: item.position ?? null,
                hireDate: item.hireDate ? new Date(item.hireDate) : null,
                employmentStatus: item.employmentStatus ?? 'active',
                createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
                updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
              }))
            : []
        );
      } catch (error) {
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  if (loading) return <div>Đang tải danh sách nhân viên...</div>;

  return (
    <>
      <PageMeta
        title="Danh sách nhân viên | HRM System"
        description="Quản lý danh sách nhân viên trong công ty"
      />
      <PageBreadcrumb pageTitle="Danh sách nhân viên" />
      
      <div className="space-y-6">
        <ComponentCard title="Danh sách nhân viên">
          {/* Actions */}
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:w-64"
              />
            </div>
            <Link
              to="/employees/add"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              + Thêm nhân viên mới
            </Link>
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
                      Email
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Vai trò
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Số điện thoại
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Phòng ban
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Chức vụ
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Trạng thái
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.employeeId} className="border-b border-gray-100 last:border-0 dark:border-white/[0.05]">
                      <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        #{employee.employeeId.toString().padStart(4, '0')}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {employee.fullName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Ngày vào: {formatDateVN(employee.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {employee.email}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {employee.position}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {employee.phone}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {employee.departmentId}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {employee.position}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Badge
                          color={
                            employee.employmentStatus === "active"
                              ? "success"
                              : employee.employmentStatus === "inactive"
                              ? "warning"
                              : "error"
                          }
                        >
                          {employee.employmentStatus === "active"
                            ? "Đang làm việc"
                            : employee.employmentStatus === "inactive"
                            ? "Tạm nghỉ"
                            : employee.employmentStatus === "terminated"
                            ? "Đã nghỉ việc"
                            : "Đã thôi việc"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/20"
                            title="Xem chi tiết"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            className="rounded-lg p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/20"
                            title="Chỉnh sửa"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                            title="Xóa"
                          >
                            <TrashBinIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Hiển thị 1 - {employees.length} trong tổng số {employees.length} nhân viên
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                Trước
              </button>
              <button className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white">
                1
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                2
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                Sau
              </button>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
