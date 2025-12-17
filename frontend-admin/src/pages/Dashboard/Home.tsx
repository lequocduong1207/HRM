import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import LineChartOne from "../../components/charts/line/LineChartOne";
import BarChartOne from "../../components/charts/bar/BarChartOne";
import { UserCircleIcon, CalenderIcon } from "../../icons";

export default function Home() {
  // Mock data - thay thế bằng API call thực tế
  const stats = [
    {
      title: "Tổng nhân viên",
      value: "145",
      change: "+12%",
      isPositive: true,
      icon: "👥",
      bgColor: "bg-blue-500",
    },
    {
      title: "Nhân viên mới",
      value: "8",
      change: "Tháng này",
      isPositive: true,
      icon: "✨",
      bgColor: "bg-green-500",
    },
    {
      title: "Đơn nghỉ phép",
      value: "12",
      change: "Chờ duyệt",
      isPositive: false,
      icon: "📅",
      bgColor: "bg-orange-500",
    },
    {
      title: "Phòng ban",
      value: "6",
      change: "Hoạt động",
      isPositive: true,
      icon: "🏢",
      bgColor: "bg-purple-500",
    },
  ];

  const recentActivities = [
    { id: 1, action: "Nhân viên mới", name: "Nguyễn Văn A", time: "2 giờ trước" },
    { id: 2, action: "Đơn nghỉ phép duyệt", name: "Trần Thị B", time: "5 giờ trước" },
    { id: 3, action: "Cập nhật thông tin", name: "Lê Văn C", time: "1 ngày trước" },
    { id: 4, action: "Thêm phòng ban mới", name: "Admin", time: "2 ngày trước" },
  ];

  return (
    <>
      <PageMeta
        title="HRM Dashboard | Quản lý Nhân sự"
        description="Trang quản trị hệ thống quản lý nhân sự"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} rounded-lg p-3 text-2xl`}>
                {stat.icon}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {stat.title}
              </h4>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
              </p>
              <span
                className={`text-sm font-medium ${
                  stat.isPositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-orange-600 dark:text-orange-400"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 mb-6">
        {/* Line Chart */}
        <div className="col-span-12 xl:col-span-8">
          <ComponentCard 
            title="Biểu đồ chấm công theo tháng"
            desc="Thống kê số lượng nhân viên chấm công đầy đủ"
          >
            <LineChartOne />
          </ComponentCard>
        </div>

        {/* Recent Activities */}
        <div className="col-span-12 xl:col-span-4">
          <ComponentCard 
            title="Hoạt động gần đây"
            desc="Các thao tác mới nhất trong hệ thống"
          >
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {activity.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* Bar Chart and Quick Actions */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Bar Chart */}
        <div className="col-span-12 xl:col-span-7">
          <ComponentCard 
            title="Thống kê nhân viên mới theo tháng"
            desc="Số lượng nhân viên được tuyển dụng trong năm"
          >
            <BarChartOne />
          </ComponentCard>
        </div>

        {/* Quick Actions */}
        <div className="col-span-12 xl:col-span-5">
          <ComponentCard 
            title="Thao tác nhanh"
            desc="Các chức năng thường dùng"
          >
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all">
                <UserCircleIcon className="w-10 h-10 mb-3 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Thêm nhân viên
                </span>
              </button>

              <button className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all">
                <CalenderIcon className="w-10 h-10 mb-3 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Duyệt nghỉ phép
                </span>
              </button>

              <button className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all">
                <span className="text-2xl mb-3">🏢</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Quản lý phòng ban
                </span>
              </button>

              <button className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all">
                <span className="text-2xl mb-3">📊</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Xem báo cáo
                </span>
              </button>
            </div>
          </ComponentCard>
        </div>
      </div>
    </>
  );
}
