import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { formatDate } from "../../utils";
import type { IEmployee } from "../../types";

interface EmployeeTableProps {
  employees: (IEmployee & { departmentName: string })[];
  onEdit: (id: string) => void;
  onDelete: (employee: IEmployee) => void;
  onViewDetail?: (id: string) => void;
}

/**
 * Presentational component for Employee Table
 * Chỉ nhận props và render UI, không chứa logic
 */
export const EmployeeTable = ({ employees, onEdit, onDelete, onViewDetail }: EmployeeTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Mã NV
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Họ và tên
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Email
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Số điện thoại
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Phòng ban
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Chức vụ
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Trạng thái
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow 
                key={employee._id} 
                className="border-b border-gray-100 last:border-0 dark:border-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer"
                onClick={() => onViewDetail?.(employee._id)}
              >
                <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  #{employee._id.slice(-6).toUpperCase()}
                </TableCell>
                <TableCell className="px-5 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {employee.fullName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Ngày vào: {formatDate(employee.hireDate)}
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {employee.email}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {employee.phone || 'N/A'}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {employee.departmentName}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {employee.position || 'N/A'}
                </TableCell>
                <TableCell className="px-5 py-4 whitespace-nowrap">
                  <Badge color={employee.isActive ? "success" : "error"}>
                    {employee.isActive ? "Đang làm việc" : "Ngừng làm việc"}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetail?.(employee._id);
                      }}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/20"
                      title="Xem chi tiết"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(employee._id);
                      }}
                      className="rounded-lg p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/20"
                      title="Chỉnh sửa"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(employee);
                      }}
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
  );
};
