import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import { PencilIcon, TrashBinIcon, CheckCircleIcon } from "../../icons";

interface Interview {
  id: number;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  interviewer: string;
  location: string;
  type: string;
  status: string;
  round: number;
}

export default function InterviewSchedule() {
  const [interviews] = useState<Interview[]>([
    {
      id: 1,
      candidateName: "Nguyễn Văn An",
      position: "Senior Full-stack Developer",
      date: "20/12/2025",
      time: "09:00 - 10:00",
      interviewer: "Trần Văn A, Nguyễn Thị B",
      location: "Phòng họp A1",
      type: "technical",
      status: "scheduled",
      round: 1,
    },
    {
      id: 2,
      candidateName: "Lê Văn Cường",
      position: "UI/UX Designer",
      date: "20/12/2025",
      time: "10:30 - 11:30",
      interviewer: "Phạm Văn C",
      location: "Phòng họp B2",
      type: "design",
      status: "scheduled",
      round: 2,
    },
    {
      id: 3,
      candidateName: "Trần Thị Bình",
      position: "Marketing Executive",
      date: "21/12/2025",
      time: "14:00 - 15:00",
      interviewer: "Lê Thị D",
      location: "Phòng họp C3",
      type: "hr",
      status: "scheduled",
      round: 1,
    },
    {
      id: 4,
      candidateName: "Phạm Thị Dung",
      position: "Senior Full-stack Developer",
      date: "19/12/2025",
      time: "15:00 - 16:00",
      interviewer: "Trần Văn A",
      location: "Phòng họp A1",
      type: "technical",
      status: "completed",
      round: 2,
    },
    {
      id: 5,
      candidateName: "Hoàng Văn Em",
      position: "Marketing Executive",
      date: "18/12/2025",
      time: "10:00 - 11:00",
      interviewer: "Lê Thị D",
      location: "Online - Zoom",
      type: "hr",
      status: "cancelled",
      round: 1,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge color="info">Đã lên lịch</Badge>;
      case "completed":
        return <Badge color="success">Hoàn thành</Badge>;
      case "cancelled":
        return <Badge color="error">Đã hủy</Badge>;
      case "rescheduled":
        return <Badge color="warning">Dời lịch</Badge>;
      default:
        return <Badge color="light">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "hr":
        return <Badge color="primary">HR</Badge>;
      case "technical":
        return <Badge color="success">Kỹ thuật</Badge>;
      case "design":
        return <Badge color="warning">Thiết kế</Badge>;
      case "manager":
        return <Badge color="info">Quản lý</Badge>;
      default:
        return <Badge color="light">{type}</Badge>;
    }
  };

  const handleAddFeedback = (interview: Interview) => {
    setSelectedInterview(interview);
    setShowFeedbackModal(true);
  };

  return (
    <>
      <PageMeta
        title="Lịch phỏng vấn | HRM System"
        description="Quản lý lịch phỏng vấn ứng viên"
      />
      <PageBreadcrumb pageTitle="Lịch phỏng vấn" />

      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Đã lên lịch</p>
            <p className="text-3xl font-bold text-blue-600">
              {interviews.filter((i) => i.status === "scheduled").length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Hoàn thành</p>
            <p className="text-3xl font-bold text-green-600">
              {interviews.filter((i) => i.status === "completed").length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Hôm nay</p>
            <p className="text-3xl font-bold text-purple-600">
              {interviews.filter((i) => i.date === "20/12/2025").length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Đã hủy</p>
            <p className="text-3xl font-bold text-red-600">
              {interviews.filter((i) => i.status === "cancelled").length}
            </p>
          </div>
        </div>

        {/* Calendar View (simplified) */}
        <ComponentCard title="Lịch trong tuần">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, index) => (
              <div
                key={day}
                className={`rounded-lg border p-4 ${
                  index === 3
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="mb-2 text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{day}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {16 + index}
                  </p>
                </div>
                {index === 3 && (
                  <div className="space-y-1">
                    <div className="rounded bg-blue-100 p-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      09:00 PV Kỹ thuật
                    </div>
                    <div className="rounded bg-purple-100 p-1 text-xs text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      10:30 PV Thiết kế
                    </div>
                  </div>
                )}
                {index === 4 && (
                  <div className="space-y-1">
                    <div className="rounded bg-green-100 p-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-200">
                      14:00 PV HR
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ComponentCard>

        <ComponentCard title="Danh sách lịch phỏng vấn">
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setShowAddModal(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              + Thêm lịch phỏng vấn
            </button>
          </div>
          {/* Filters */}
          <div className="mb-4 flex flex-col gap-2 sm:flex-row">
            <input
              type="date"
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <select className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="">Tất cả loại</option>
              <option value="hr">HR</option>
              <option value="technical">Kỹ thuật</option>
              <option value="design">Thiết kế</option>
              <option value="manager">Quản lý</option>
            </select>
            <select className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="">Tất cả trạng thái</option>
              <option value="scheduled">Đã lên lịch</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          {/* Interview List */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Ứng viên
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Vị trí
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Ngày giờ
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Người PV
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Địa điểm
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Loại
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Vòng
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {interviews.map((interview) => (
                  <tr
                    key={interview.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {interview.candidateName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {interview.position}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {interview.date}
                        </p>
                        <p className="text-xs">{interview.time}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {interview.interviewer}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {interview.location}
                    </td>
                    <td className="px-4 py-3 text-sm">{getTypeBadge(interview.type)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      Vòng {interview.round}
                    </td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(interview.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {interview.status === "completed" ? (
                          <button
                            onClick={() => handleAddFeedback(interview)}
                            className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-700"
                            title="Thêm đánh giá"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                        ) : interview.status === "scheduled" ? (
                          <>
                            <button
                              className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
                              title="Sửa"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
                              title="Hủy"
                            >
                              <TrashBinIcon className="h-4 w-4" />
                            </button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ComponentCard>
      </div>

      {/* Add Interview Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Thêm lịch phỏng vấn
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ứng viên
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white">
                    <option value="">Chọn ứng viên</option>
                    <option value="1">Nguyễn Văn An - Senior Developer</option>
                    <option value="2">Trần Thị Bình - Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ngày phỏng vấn
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Thời gian
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Loại phỏng vấn
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white">
                    <option value="hr">HR</option>
                    <option value="technical">Kỹ thuật</option>
                    <option value="design">Thiết kế</option>
                    <option value="manager">Quản lý</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Vòng phỏng vấn
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white">
                    <option value="1">Vòng 1</option>
                    <option value="2">Vòng 2</option>
                    <option value="3">Vòng 3</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Người phỏng vấn
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tên người phỏng vấn"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Địa điểm
                  </label>
                  <input
                    type="text"
                    placeholder="Phòng họp hoặc link online"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ghi chú
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ghi chú về buổi phỏng vấn..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Hủy
              </button>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                Thêm lịch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Đánh giá phỏng vấn - {selectedInterview.candidateName}
            </h3>
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Vị trí:</strong> {selectedInterview.position}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Thời gian:</strong> {selectedInterview.date} | {selectedInterview.time}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Người PV:</strong> {selectedInterview.interviewer}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Đánh giá chung (1-5 sao)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="text-3xl hover:scale-110 transition-transform"
                    >
                      ☆
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Kỹ năng chuyên môn
                </label>
                <textarea
                  rows={3}
                  placeholder="Đánh giá về kỹ năng chuyên môn..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Kỹ năng mềm
                </label>
                <textarea
                  rows={3}
                  placeholder="Đánh giá về kỹ năng giao tiếp, làm việc nhóm..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Điểm mạnh
                </label>
                <textarea
                  rows={2}
                  placeholder="Những điểm mạnh của ứng viên..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Điểm cần cải thiện
                </label>
                <textarea
                  rows={2}
                  placeholder="Những điểm cần cải thiện..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quyết định
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white">
                  <option value="">Chọn quyết định</option>
                  <option value="pass">Đạt - Chuyển vòng tiếp</option>
                  <option value="hire">Đạt - Tuyển dụng</option>
                  <option value="consider">Cân nhắc</option>
                  <option value="reject">Không đạt</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Đóng
              </button>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                Lưu đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
