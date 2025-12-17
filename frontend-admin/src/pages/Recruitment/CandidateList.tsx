import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import { DownloadIcon, EyeIcon, CheckCircleIcon, CloseIcon } from "../../icons";

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  education: string;
  appliedDate: string;
  status: string;
  rating: number;
  cvUrl: string;
}

export default function CandidateList() {
  const [candidates] = useState<Candidate[]>([
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "nguyenvanan@email.com",
      phone: "0901234567",
      position: "Senior Full-stack Developer",
      experience: "5 năm",
      education: "Đại học Bách Khoa",
      appliedDate: "10/12/2025",
      status: "new",
      rating: 0,
      cvUrl: "/cv/candidate1.pdf",
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "tranbinth@email.com",
      phone: "0907654321",
      position: "Marketing Executive",
      experience: "3 năm",
      education: "Đại học Kinh tế",
      appliedDate: "12/12/2025",
      status: "reviewed",
      rating: 4,
      cvUrl: "/cv/candidate2.pdf",
    },
    {
      id: 3,
      name: "Lê Văn Cường",
      email: "levancuong@email.com",
      phone: "0912345678",
      position: "UI/UX Designer",
      experience: "4 năm",
      education: "Đại học KHTN",
      appliedDate: "13/12/2025",
      status: "interview",
      rating: 5,
      cvUrl: "/cv/candidate3.pdf",
    },
    {
      id: 4,
      name: "Phạm Thị Dung",
      email: "phamthidung@email.com",
      phone: "0923456789",
      position: "Senior Full-stack Developer",
      experience: "6 năm",
      education: "Đại học FPT",
      appliedDate: "14/12/2025",
      status: "approved",
      rating: 5,
      cvUrl: "/cv/candidate4.pdf",
    },
    {
      id: 5,
      name: "Hoàng Văn Em",
      email: "hoangvanem@email.com",
      phone: "0934567890",
      position: "Marketing Executive",
      experience: "2 năm",
      education: "Đại học Ngoại Thương",
      appliedDate: "15/12/2025",
      status: "rejected",
      rating: 2,
      cvUrl: "/cv/candidate5.pdf",
    },
  ]);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge color="info">Mới nộp</Badge>;
      case "reviewed":
        return <Badge color="warning">Đã xem</Badge>;
      case "interview":
        return <Badge color="primary">Phỏng vấn</Badge>;
      case "approved":
        return <Badge color="success">Đạt</Badge>;
      case "rejected":
        return <Badge color="error">Không đạt</Badge>;
      default:
        return <Badge color="light">{status}</Badge>;
    }
  };

  const getRatingStars = (rating: number) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  const handleViewDetail = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowDetailModal(true);
  };

  return (
    <>
      <PageMeta
        title="Danh sách ứng viên | HRM System"
        description="Quản lý hồ sơ ứng viên"
      />
      <PageBreadcrumb pageTitle="Danh sách ứng viên" />

      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Mới nộp</p>
            <p className="text-3xl font-bold text-blue-600">
              {candidates.filter((c) => c.status === "new").length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Đã xem</p>
            <p className="text-3xl font-bold text-orange-600">
              {candidates.filter((c) => c.status === "reviewed").length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Phỏng vấn</p>
            <p className="text-3xl font-bold text-purple-600">
              {candidates.filter((c) => c.status === "interview").length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Đạt</p>
            <p className="text-3xl font-bold text-green-600">
              {candidates.filter((c) => c.status === "approved").length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Không đạt</p>
            <p className="text-3xl font-bold text-red-600">
              {candidates.filter((c) => c.status === "rejected").length}
            </p>
          </div>
        </div>

        <ComponentCard title="Hồ sơ ứng viên">
          {/* Filters */}
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tìm kiếm ứng viên..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:w-64"
              />
              <select className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <option value="">Tất cả vị trí</option>
                <option value="dev">Developer</option>
                <option value="marketing">Marketing</option>
                <option value="design">Designer</option>
              </select>
              <select className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <option value="">Tất cả trạng thái</option>
                <option value="new">Mới nộp</option>
                <option value="reviewed">Đã xem</option>
                <option value="interview">Phỏng vấn</option>
                <option value="approved">Đạt</option>
                <option value="rejected">Không đạt</option>
              </select>
            </div>
          </div>

          {/* Candidate Cards */}
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                  {/* Candidate Info */}
                  <div className="lg:col-span-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                        <span className="text-lg font-semibold text-blue-600 dark:text-blue-300">
                          {candidate.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {candidate.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {candidate.position}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {getRatingStars(candidate.rating)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Details */}
                  <div className="lg:col-span-5">
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600 dark:text-gray-400">
                        📧 {candidate.email}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        📱 {candidate.phone}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        💼 Kinh nghiệm: {candidate.experience}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        🎓 {candidate.education}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Nộp: {candidate.appliedDate}
                      </p>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-start gap-3 lg:col-span-3 lg:items-end">
                    {getStatusBadge(candidate.status)}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewDetail(candidate)}
                        className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700"
                      >
                        <EyeIcon className="h-3 w-3" />
                        Chi tiết
                      </button>
                      <button className="flex items-center gap-1 rounded-lg bg-gray-600 px-3 py-1.5 text-xs text-white hover:bg-gray-700">
                        <DownloadIcon className="h-3 w-3" />
                        CV
                      </button>
                      {candidate.status !== "approved" && candidate.status !== "rejected" && (
                        <>
                          <button className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs text-white hover:bg-green-700">
                            <CheckCircleIcon className="h-3 w-3" />
                            Đạt
                          </button>
                          <button className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-700">
                            <CloseIcon className="h-3 w-3" />
                            Loại
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ComponentCard>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Chi tiết ứng viên
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Họ và tên
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedCandidate.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Vị trí ứng tuyển
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedCandidate.position}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedCandidate.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Số điện thoại
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedCandidate.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kinh nghiệm
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedCandidate.experience}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Trình độ
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedCandidate.education}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Đánh giá
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {getRatingStars(selectedCandidate.rating)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Trạng thái
                  </label>
                  <div className="mt-1">{getStatusBadge(selectedCandidate.status)}</div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Đánh giá chi tiết
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  placeholder="Nhập đánh giá về ứng viên..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Chọn đánh giá (1-5 sao)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="text-2xl hover:scale-110 transition-transform"
                    >
                      {star <= selectedCandidate.rating ? "⭐" : "☆"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowDetailModal(false)}
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
