import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { CalenderIcon } from "../../icons";

interface AttendanceRecord {
  id: number;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  status: string;
}

export default function AttendanceList() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance] = useState<AttendanceRecord[]>([
    {
      id: 1,
      employeeId: "NV001",
      employeeName: "Nguyễn Văn A",
      department: "Phát triển phần mềm",
      date: "15/12/2025",
      checkIn: "08:30",
      checkOut: "17:30",
      workHours: "8h 30m",
      status: "Present",
    },
    {
      id: 2,
      employeeId: "NV002",
      employeeName: "Trần Thị B",
      department: "Nhân sự",
      date: "15/12/2025",
      checkIn: "08:45",
      checkOut: "17:45",
      workHours: "8h 30m",
      status: "Late",
    },
    {
      id: 3,
      employeeId: "NV003",
      employeeName: "Lê Văn C",
      department: "Kế toán",
      date: "15/12/2025",
      checkIn: "08:15",
      checkOut: "17:15",
      workHours: "8h 30m",
      status: "Present",
    },
    {
      id: 4,
      employeeId: "NV004",
      employeeName: "Phạm Thị D",
      department: "Marketing",
      date: "15/12/2025",
      checkIn: "-",
      checkOut: "-",
      workHours: "0h",
      status: "Absent",
    },
    {
      id: 5,
      employeeId: "NV005",
      employeeName: "Hoàng Văn E",
      department: "Phát triển phần mềm",
      date: "15/12/2025",
      checkIn: "09:30",
      checkOut: "18:30",
      workHours: "8h 30m",
      status: "Late",
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Present":
        return <Badge color="success">Đúng giờ</Badge>;
      case "Late":
        return <Badge color="warning">Đi muộn</Badge>;
      case "Absent":
        return <Badge color="error">Vắng mặt</Badge>;
      default:
        return <Badge color="light">{status}</Badge>;
    }
  };

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
                <p className="text-sm text-gray-500 dark:text-gray-400">Đúng giờ</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">6</p>
              </div>
            </div>
          </div>
        </div>

        <ComponentCard title="Chi tiết chấm công">
          {/* Filters */}
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
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
                  {attendance.map((record) => (
                    <TableRow key={record.id} className="border-b border-gray-100 last:border-0 dark:border-white/[0.05]">
                      <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {record.employeeId}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-900 dark:text-white">
                        {record.employeeName}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {record.department}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {record.date}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {record.checkIn}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {record.checkOut}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {record.workHours}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        {getStatusBadge(record.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
