import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import { CheckCircleIcon, CloseIcon } from "../../icons";

interface LeaveRequest {
  id: number;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  submittedDate: string;
}

export default function LeaveApproval() {
  const [leaveRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      employeeId: "NV001",
      employeeName: "Nguyễn Văn A",
      department: "Phát triển phần mềm",
      leaveType: "Nghỉ phép năm",
      startDate: "20/12/2025",
      endDate: "22/12/2025",
      days: 3,
      reason: "Du lịch cùng gia đình",
      status: "Pending",
      submittedDate: "10/12/2025",
    },
    {
      id: 2,
      employeeId: "NV003",
      employeeName: "Lê Văn C",
      department: "Kế toán",
      leaveType: "Nghỉ ốm",
      startDate: "16/12/2025",
      endDate: "17/12/2025",
      days: 2,
      reason: "Bị cảm, cần nghỉ dưỡng",
      status: "Pending",
      submittedDate: "15/12/2025",
    },
    {
      id: 3,
      employeeId: "NV005",
      employeeName: "Hoàng Văn E",
      department: "Phát triển phần mềm",
      leaveType: "Nghỉ phép năm",
      startDate: "23/12/2025",
      endDate: "27/12/2025",
      days: 5,
      reason: "Về quê nghỉ Tết",
      status: "Pending",
      submittedDate: "12/12/2025",
    },
  ]);

  const handleApprove = (id: number) => {
    console.log("Approve leave request:", id);
    // TODO: Call API to approve leave request
  };

  const handleReject = (id: number) => {
    console.log("Reject leave request:", id);
    // TODO: Call API to reject leave request
  };

  return (
    <>
      <PageMeta
        title="Duyệt đơn nghỉ phép | HRM System"
        description="Quản lý và duyệt đơn nghỉ phép của nhân viên"
      />
      <PageBreadcrumb pageTitle="Duyệt đơn nghỉ phép" />

      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Chờ duyệt</p>
            <p className="text-3xl font-bold text-orange-600">{leaveRequests.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Đã duyệt hôm nay</p>
            <p className="text-3xl font-bold text-green-600">5</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Đã từ chối</p>
            <p className="text-3xl font-bold text-red-600">1</p>
          </div>
        </div>

        <ComponentCard title="Danh sách đơn chờ duyệt">
          {/* Filters */}
          <div className="mb-4 flex gap-2">
            <select className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="">Tất cả loại đơn</option>
              <option value="annual">Nghỉ phép năm</option>
              <option value="sick">Nghỉ ốm</option>
              <option value="unpaid">Nghỉ không lương</option>
              <option value="other">Khác</option>
            </select>
            <select className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="">Tất cả phòng ban</option>
              <option value="IT">Phát triển phần mềm</option>
              <option value="HR">Nhân sự</option>
              <option value="Accounting">Kế toán</option>
            </select>
          </div>

          {/* Leave Requests Cards */}
          <div className="space-y-4">
            {leaveRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                  {/* Employee Info */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                        <span className="text-lg font-semibold text-blue-600 dark:text-blue-300">
                          {request.employeeName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {request.employeeName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {request.employeeId}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {request.department}
                    </p>
                  </div>

                  {/* Leave Details */}
                  <div className="lg:col-span-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge color="info">{request.leaveType}</Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {request.days} ngày
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Từ: </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {request.startDate}
                        </span>
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="text-gray-600 dark:text-gray-400">Đến: </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {request.endDate}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Lý do: </span>
                        <span className="text-gray-900 dark:text-white">
                          {request.reason}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Gửi ngày: {request.submittedDate}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 lg:col-span-3 lg:justify-end">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      Duyệt
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300"
                    >
                      <CloseIcon className="h-4 w-4" />
                      Từ chối
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {leaveRequests.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Không có đơn nghỉ phép nào đang chờ duyệt
              </p>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
