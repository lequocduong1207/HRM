import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BarChartOne from "../../components/charts/bar/BarChartOne";

export default function AttendanceHistory() {
  const monthlyData = [
    { month: "Tháng 1", present: 22, late: 3, absent: 1 },
    { month: "Tháng 2", present: 20, late: 2, absent: 2 },
    { month: "Tháng 3", present: 23, late: 1, absent: 0 },
    { month: "Tháng 4", present: 21, late: 4, absent: 1 },
    { month: "Tháng 5", present: 22, late: 2, absent: 2 },
    { month: "Tháng 6", present: 23, late: 1, absent: 1 },
  ];

  return (
    <>
      <PageMeta
        title="Lịch sử chấm công | HRM System"
        description="Xem lịch sử chấm công theo thời gian"
      />
      <PageBreadcrumb pageTitle="Lịch sử chấm công" />

      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tổng ngày làm việc
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">131</p>
            <p className="text-sm text-green-600 mt-2">6 tháng qua</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Trung bình đi muộn
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">2.2</p>
            <p className="text-sm text-orange-600 mt-2">lần/tháng</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tỷ lệ đi làm
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">94.3%</p>
            <p className="text-sm text-green-600 mt-2">Xuất sắc</p>
          </div>
        </div>

        {/* Chart */}
        <ComponentCard
          title="Biểu đồ chấm công theo tháng"
          desc="Thống kê chi tiết 6 tháng gần đây"
        >
          <BarChartOne />
        </ComponentCard>

        {/* Monthly Breakdown */}
        <ComponentCard title="Chi tiết theo tháng">
          <div className="space-y-3">
            {monthlyData.map((data, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {data.month}
                  </h4>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-600">
                      ✓ {data.present} ngày
                    </span>
                    <span className="text-orange-600">
                      ⚠ {data.late} muộn
                    </span>
                    <span className="text-red-600">
                      ✗ {data.absent} vắng
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${
                          (data.present / (data.present + data.late + data.absent)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
