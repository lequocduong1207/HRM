import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
import { useEmployeeListLogic } from "../../hooks/useEmployeeListLogic";

/**
 * Employee Report Page - Báo cáo nhân sự
 * Hiển thị các thống kê tổng quan về nhân viên
 */
export default function EmployeeReport() {
  const {
    employees,
    totalCount,
    loading,
    error,
  } = useEmployeeListLogic();

  // Loading state
  if (loading) {
    return <LoadingState message="Đang tải dữ liệu báo cáo..." />;
  }

  // Error state
  if (error) {
    return <ErrorState message={error} />;
  }

  // Tính toán các thống kê
  const activeEmployees = employees.filter(e => e.isActive).length;
  const inactiveEmployees = employees.filter(e => !e.isActive).length;

  // Thống kê theo phòng ban
  const departmentStats = employees.reduce((acc, emp) => {
    const deptName = emp.departmentName|| 'Chưa phân công';
    if (!acc[deptName]) {
      acc[deptName] = { total: 0, active: 0, inactive: 0 };
    }
    acc[deptName].total++;
    if (emp.isActive) {
      acc[deptName].active++;
    } else {
      acc[deptName].inactive++;
    }
    return acc;
  }, {} as Record<string, { total: number; active: number; inactive: number }>);

  return (
    <>
      <PageMeta
        title="Báo cáo nhân sự | HRM System"
        description="Thống kê và báo cáo về nhân viên trong công ty"
      />
      <PageBreadcrumb pageTitle="Báo cáo nhân sự" />
      
      <div className="space-y-6">
        {/* Thống kê tổng quan */}
        <ComponentCard title="Tổng quan nhân sự">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 dark:border-gray-800 dark:from-blue-900/20 dark:to-blue-800/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tổng số nhân viên
                  </p>
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                    {totalCount}
                  </p>
                </div>
                <div className="rounded-full bg-blue-600/10 p-3">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-green-100 p-6 dark:border-gray-800 dark:from-green-900/20 dark:to-green-800/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Đang làm việc
                  </p>
                  <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">
                    {activeEmployees}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {totalCount > 0 ? ((activeEmployees / totalCount) * 100).toFixed(1) : 0}% tổng số
                  </p>
                </div>
                <div className="rounded-full bg-green-600/10 p-3">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-red-50 to-red-100 p-6 dark:border-gray-800 dark:from-red-900/20 dark:to-red-800/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Nghỉ làm
                  </p>
                  <p className="text-4xl font-bold text-red-600 dark:text-red-400 mt-2">
                    {inactiveEmployees}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {totalCount > 0 ? ((inactiveEmployees / totalCount) * 100).toFixed(1) : 0}% tổng số
                  </p>
                </div>
                <div className="rounded-full bg-red-600/10 p-3">
                  <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* Thống kê theo phòng ban */}
        <ComponentCard title="Thống kê theo phòng ban">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Phòng ban
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tổng số
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Đang làm việc
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nghỉ làm
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tỷ lệ làm việc
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-white/[0.02] divide-y divide-gray-200 dark:divide-gray-700">
                {Object.entries(departmentStats).map(([deptName, stats]) => (
                  <tr key={deptName} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {deptName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {stats.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                      {stats.active}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                      {stats.inactive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-24">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(stats.active / stats.total) * 100}%` }}
                          ></div>
                        </div>
                        <span>{((stats.active / stats.total) * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ComponentCard>

        {/* Biểu đồ tròn trạng thái nhân viên */}
        <ComponentCard title="Biểu đồ trạng thái nhân viên">
          <div className="flex flex-col items-center justify-center p-8">
            <div className="relative w-64 h-64">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-gray-200 dark:text-gray-700"
                />
                {/* Active employees arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={`${(activeEmployees / totalCount) * 251.2} 251.2`}
                  className="text-green-600 dark:text-green-400"
                />
                {/* Inactive employees arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={`${(inactiveEmployees / totalCount) * 251.2} 251.2`}
                  strokeDashoffset={`-${(activeEmployees / totalCount) * 251.2}`}
                  className="text-red-600 dark:text-red-400"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalCount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nhân viên</p>
                </div>
              </div>
            </div>
            <div className="flex gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-600"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Đang làm việc ({activeEmployees})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-600"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Nghỉ làm ({inactiveEmployees})
                </span>
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
