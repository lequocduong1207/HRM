import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import LineChartOne from "../../components/charts/line/LineChartOne";
import BarChartOne from "../../components/charts/bar/BarChartOne";

export default function ReportsOverview() {
  const stats = [
    {
      title: "Tỷ lệ chấm công",
      value: "94.5%",
      change: "+2.3%",
      color: "bg-green-500",
    },
    {
      title: "Trung bình giờ làm",
      value: "8.2h",
      change: "+0.5h",
      color: "bg-blue-500",
    },
    {
      title: "Nghỉ phép tháng này",
      value: "18 ngày",
      change: "-3 ngày",
      color: "bg-orange-500",
    },
    {
      title: "Tuyển dụng mới",
      value: "8 người",
      change: "+2 người",
      color: "bg-purple-500",
    },
  ];

  return (
    <>
      <PageMeta
        title="Báo cáo tổng quan | HRM System"
        description="Thống kê và báo cáo tổng quan hệ thống HRM"
      />
      <PageBreadcrumb pageTitle="Báo cáo tổng quan" />

      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${stat.color} h-12 w-12 rounded-lg`}></div>
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ComponentCard
            title="Xu hướng chấm công"
            desc="Biểu đồ chấm công 12 tháng gần đây"
          >
            <LineChartOne />
          </ComponentCard>

          <ComponentCard
            title="Tuyển dụng theo tháng"
            desc="Số lượng nhân viên mới theo tháng"
          >
            <BarChartOne />
          </ComponentCard>
        </div>

        {/* Detailed Reports */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ComponentCard
            title="Top phòng ban hiệu suất cao"
            desc="Xếp hạng theo tỷ lệ chấm công"
          >
            <div className="space-y-4">
              {[
                { name: "Phát triển phần mềm", score: 98.5, employees: 45 },
                { name: "Kế toán", score: 96.2, employees: 12 },
                { name: "Marketing", score: 94.8, employees: 18 },
                { name: "Nhân sự", score: 93.1, employees: 8 },
                { name: "Kinh doanh", score: 91.5, employees: 22 },
              ].map((dept, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <span className="font-semibold text-blue-600 dark:text-blue-300">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {dept.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {dept.employees} nhân viên
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {dept.score}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard
            title="Thống kê nghỉ phép"
            desc="Chi tiết đơn nghỉ phép tháng này"
          >
            <div className="space-y-4">
              {[
                {
                  type: "Nghỉ phép năm",
                  count: 12,
                  days: 36,
                  color: "bg-blue-500",
                },
                {
                  type: "Nghỉ ốm",
                  count: 5,
                  days: 8,
                  color: "bg-orange-500",
                },
                {
                  type: "Nghỉ không lương",
                  count: 2,
                  days: 4,
                  color: "bg-red-500",
                },
                {
                  type: "Nghỉ khác",
                  count: 1,
                  days: 1,
                  color: "bg-gray-500",
                },
              ].map((leave, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className={`${leave.color} h-3 w-3 rounded-full`}></div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {leave.type}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {leave.count} đơn
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {leave.days} ngày
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ComponentCard>
        </div>

        {/* Export Options */}
        <ComponentCard
          title="Xuất báo cáo"
          desc="Tải xuống báo cáo dưới các định dạng khác nhau"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-green-500 hover:bg-green-50 dark:border-gray-700 dark:hover:bg-green-950/20">
              <span className="text-2xl">📊</span>
              <span className="font-medium text-gray-900 dark:text-white">
                Xuất Excel
              </span>
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-red-500 hover:bg-red-50 dark:border-gray-700 dark:hover:bg-red-950/20">
              <span className="text-2xl">📄</span>
              <span className="font-medium text-gray-900 dark:text-white">
                Xuất PDF
              </span>
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:hover:bg-blue-950/20">
              <span className="text-2xl">📧</span>
              <span className="font-medium text-gray-900 dark:text-white">
                Gửi Email
              </span>
            </button>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
