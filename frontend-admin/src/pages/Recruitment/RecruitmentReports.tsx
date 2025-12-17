import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import LineChartOne from "../../components/charts/line/LineChartOne";
import BarChartOne from "../../components/charts/bar/BarChartOne";

export default function RecruitmentReports() {
  return (
    <>
      <PageMeta
        title="Báo cáo tuyển dụng | HRM System"
        description="Thống kê và báo cáo tuyển dụng"
      />
      <PageBreadcrumb pageTitle="Báo cáo tuyển dụng" />

      <div className="space-y-6">
        {/* Overview Statistics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tổng ứng viên</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">247</p>
                <p className="mt-1 text-xs text-green-600">+12% so với tháng trước</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <svg
                  className="h-6 w-6 text-blue-600 dark:text-blue-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tỉ lệ tuyển dụng</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">8.5%</p>
                <p className="mt-1 text-xs text-green-600">+2.1% so với tháng trước</p>
              </div>
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Thời gian TB</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">28 ngày</p>
                <p className="mt-1 text-xs text-red-600">+3 ngày so với tháng trước</p>
              </div>
              <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                <svg
                  className="h-6 w-6 text-orange-600 dark:text-orange-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Chi phí TB/người</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">4.2M</p>
                <p className="mt-1 text-xs text-green-600">-0.5M so với tháng trước</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                <svg
                  className="h-6 w-6 text-purple-600 dark:text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recruitment Funnel */}
        <ComponentCard title="Phễu tuyển dụng (Tháng 12/2025)">
          <div className="space-y-4">
            <div className="relative">
              <div className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nộp hồ sơ
                </div>
                <div className="flex-1">
                  <div className="h-12 rounded-lg bg-blue-500 flex items-center justify-end px-4 text-white font-semibold">
                    247 ứng viên (100%)
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Đã xem CV
                </div>
                <div className="flex-1">
                  <div className="h-12 rounded-lg bg-purple-500 flex items-center justify-end px-4 text-white font-semibold" style={{ width: '75%' }}>
                    185 ứng viên (75%)
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phỏng vấn
                </div>
                <div className="flex-1">
                  <div className="h-12 rounded-lg bg-orange-500 flex items-center justify-end px-4 text-white font-semibold" style={{ width: '40%' }}>
                    98 ứng viên (40%)
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Offer
                </div>
                <div className="flex-1">
                  <div className="h-12 rounded-lg bg-yellow-500 flex items-center justify-end px-4 text-white font-semibold" style={{ width: '15%' }}>
                    37 ứng viên (15%)
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Đã tuyển
                </div>
                <div className="flex-1">
                  <div className="h-12 rounded-lg bg-green-500 flex items-center justify-end px-4 text-white font-semibold" style={{ width: '8.5%' }}>
                    21 người (8.5%)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">247 → 185</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tỉ lệ xem CV: 75%</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">185 → 98</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tỉ lệ PV: 53%</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">98 → 21</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tỉ lệ đạt: 21.4%</p>
            </div>
          </div>
        </ComponentCard>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ComponentCard title="Xu hướng tuyển dụng theo tháng">
            <LineChartOne />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="font-semibold text-blue-600">Ứng viên</p>
                <p className="text-gray-600 dark:text-gray-400">Số lượng nộp hồ sơ</p>
              </div>
              <div>
                <p className="font-semibold text-green-600">Phỏng vấn</p>
                <p className="text-gray-600 dark:text-gray-400">Số lượng PV</p>
              </div>
              <div>
                <p className="font-semibold text-orange-600">Tuyển dụng</p>
                <p className="text-gray-600 dark:text-gray-400">Số lượng tuyển</p>
              </div>
            </div>
          </ComponentCard>

          <ComponentCard title="Nguồn ứng viên hiệu quả">
            <BarChartOne />
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">LinkedIn</span>
                <span className="font-semibold text-gray-900 dark:text-white">45%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Website công ty</span>
                <span className="font-semibold text-gray-900 dark:text-white">28%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">TopCV/VietnamWorks</span>
                <span className="font-semibold text-gray-900 dark:text-white">18%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Giới thiệu nội bộ</span>
                <span className="font-semibold text-gray-900 dark:text-white">9%</span>
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Performance by Position */}
        <ComponentCard title="Hiệu quả tuyển dụng theo vị trí">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Vị trí
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Đã đăng
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Ứng viên
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Phỏng vấn
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Đã tuyển
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tỉ lệ
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Thời gian TB
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Chi phí
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    Full-stack Developer
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    5
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    87
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    35
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    8
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-semibold text-green-600">
                    9.2%
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    32 ngày
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    5.1M
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    Marketing Executive
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    3
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    64
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    28
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    5
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-semibold text-green-600">
                    7.8%
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    25 ngày
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    3.8M
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    UI/UX Designer
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    2
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    43
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    18
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    4
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-semibold text-green-600">
                    9.3%
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    28 ngày
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    4.5M
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    HR Manager
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    1
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    31
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    12
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    3
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-semibold text-green-600">
                    9.7%
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    35 ngày
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    6.2M
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    Data Analyst
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    2
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    22
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    5
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    1
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-semibold text-orange-600">
                    4.5%
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    40 ngày
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    7.5M
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </ComponentCard>

        {/* Export Options */}
        <div className="flex justify-end gap-2">
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            Xuất PDF
          </button>
          <button className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">
            Xuất Excel
          </button>
        </div>
      </div>
    </>
  );
}
