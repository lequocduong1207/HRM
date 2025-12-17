import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";

export default function LeaveRequest() {
  const [formData, setFormData] = useState({
    leaveType: "annual",
    startDate: "",
    endDate: "",
    reason: "",
    emergency: false,
  });

  const [leaveBalance] = useState({
    annual: 12,
    sick: 10,
    unpaid: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Leave request:", formData);
    // TODO: Call API to submit leave request
  };

  return (
    <>
      <PageMeta
        title="Đơn nghỉ phép | HRM System"
        description="Gửi đơn xin nghỉ phép"
      />
      <PageBreadcrumb pageTitle="Đơn nghỉ phép" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Leave Balance */}
        <div className="lg:col-span-1">
          <ComponentCard title="Số ngày nghỉ còn lại" desc="Năm 2025">
            <div className="space-y-4">
              <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nghỉ phép năm
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {leaveBalance.annual} ngày
                </p>
              </div>
              <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/20">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nghỉ ốm
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {leaveBalance.sick} ngày
                </p>
              </div>
              <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nghỉ không lương
                </p>
                <p className="text-3xl font-bold text-gray-600">
                  Không giới hạn
                </p>
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Leave Request Form */}
        <div className="lg:col-span-2">
          <ComponentCard title="Gửi đơn nghỉ phép mới" desc="Điền thông tin đơn xin nghỉ">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Loại nghỉ phép <span className="text-red-500">*</span>
                </label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={(e) =>
                    setFormData({ ...formData, leaveType: e.target.value })
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="annual">Nghỉ phép năm</option>
                  <option value="sick">Nghỉ ốm</option>
                  <option value="unpaid">Nghỉ không lương</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Từ ngày <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Đến ngày <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Lý do <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  required
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Mô tả lý do xin nghỉ..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="emergency"
                  checked={formData.emergency}
                  onChange={(e) =>
                    setFormData({ ...formData, emergency: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="emergency"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Nghỉ khẩn cấp (cần duyệt gấp)
                </label>
              </div>

              <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950/20">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Lưu ý:</strong> Đơn xin nghỉ phép cần được gửi trước
                  ít nhất 3 ngày làm việc. Đơn khẩn cấp cần có lý do chính
                  đáng.
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Gửi đơn
                </button>
              </div>
            </form>
          </ComponentCard>

          {/* Recent Requests */}
          <div className="mt-6">
            <ComponentCard title="Đơn gần đây" desc="5 đơn mới nhất của bạn">
              <div className="space-y-3">
                {[
                  {
                    date: "20-22/12/2025",
                    type: "Nghỉ phép năm",
                    status: "Pending",
                  },
                  {
                    date: "10-11/12/2025",
                    type: "Nghỉ ốm",
                    status: "Approved",
                  },
                  {
                    date: "05/12/2025",
                    type: "Nghỉ phép năm",
                    status: "Approved",
                  },
                ].map((request, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {request.date}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {request.type}
                      </p>
                    </div>
                    <Badge
                      color={
                        request.status === "Approved"
                          ? "success"
                          : request.status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {request.status === "Approved"
                        ? "Đã duyệt"
                        : request.status === "Pending"
                        ? "Chờ duyệt"
                        : "Từ chối"}
                    </Badge>
                  </div>
                ))}
              </div>
            </ComponentCard>
          </div>
        </div>
      </div>
    </>
  );
}
