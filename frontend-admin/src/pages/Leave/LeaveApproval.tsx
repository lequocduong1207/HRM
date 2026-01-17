import { useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import { CheckCircleIcon, CloseIcon } from "../../icons";
import { useLeaveApprovalLogic } from "../../hooks/useLeaveApprovalLogic";

/**
 * LeaveApproval Page - Presentation Component
 * Tất cả logic đã được tách ra useLeaveApprovalLogic hook
 */
export default function LeaveApproval() {
  const {
    filteredRequests,
    filterStatus,
    filterType,
    filterDept,
    loading,
    fetching,
    stats,
    departments,
    setFilterStatus,
    setFilterType,
    setFilterDept,
    fetchLeaveRequests,
    getEmployeeName,
    getDepartmentName,
    getLeaveTypeName,
    formatDateRange,
    calculateDays,
    handleApprove,
    handleReject,
  } = useLeaveApprovalLogic();

  // Fetch leave requests on mount and when filters change
  useEffect(() => {
    fetchLeaveRequests();
  }, [filterStatus, filterType, filterDept]);

  return (
    <>
      <PageMeta
        title="Duyệt đơn nghỉ phép | HRM System"
        description="Quản lý và duyệt đơn nghỉ phép của nhân viên"
      />
      <PageBreadcrumb pageTitle="Duyệt đơn nghỉ phép" />

      {/* Kanban-Style Stats */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-4">
        <button
          onClick={() => setFilterStatus('all')}
          className={`rounded-xl border-2 p-4 sm:p-5 text-left transition-all ${
            filterStatus === 'all'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
              : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-white/[0.03]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Tất cả</span>
            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
        </button>

        <button
          onClick={() => setFilterStatus('pending')}
          className={`rounded-xl border-2 p-4 sm:p-5 text-left transition-all ${
            filterStatus === 'pending'
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
              : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-white/[0.03]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Chờ duyệt</span>
            <div className="h-2 w-2 rounded-full bg-orange-500"></div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-orange-600">{stats.pending}</div>
        </button>

        <button
          onClick={() => setFilterStatus('approved')}
          className={`rounded-xl border-2 p-4 sm:p-5 text-left transition-all ${
            filterStatus === 'approved'
              ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
              : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-white/[0.03]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Đã duyệt</span>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-green-600">{stats.approved}</div>
        </button>

        <button
          onClick={() => setFilterStatus('rejected')}
          className={`rounded-xl border-2 p-4 sm:p-5 text-left transition-all ${
            filterStatus === 'rejected'
              ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
              : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-white/[0.03]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Từ chối</span>
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-red-600">{stats.rejected}</div>
        </button>
      </div>

      <ComponentCard title={`Danh sách đơn ${filterStatus === 'pending' ? 'chờ duyệt' : filterStatus === 'approved' ? 'đã duyệt' : filterStatus === 'rejected' ? 'đã từ chối' : ''}`}>
        {/* Filters */}
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex-1 sm:flex-none rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">Tất cả loại đơn</option>
            <option value="annual">Nghỉ phép năm</option>
            <option value="sick">Nghỉ ốm</option>
            <option value="unpaid">Nghỉ không lương</option>
            <option value="maternity">Nghỉ thai sản</option>
            <option value="other">Khác</option>
          </select>
          <select 
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="flex-1 sm:flex-none rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">Tất cả phòng ban</option>
            {departments?.filter(d => !d.isDeleted).map(dept => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
          </select>
        </div>

        {/* Leave Requests List */}
        {fetching ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2 text-sm text-gray-500">Đang tải...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">Không có đơn nghỉ phép nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const days = calculateDays(request.startDate, request.endDate);
              const empName = getEmployeeName(request.employeeId);
              const deptName = getDepartmentName(request.employeeId);
              const reqStatus = request.status.toLowerCase();
              const statusConfig = {
                pending: { color: 'orange', label: 'Chờ duyệt', badge: 'warning' },
                approved: { color: 'green', label: 'Đã duyệt', badge: 'success' },
                rejected: { color: 'red', label: 'Từ chối', badge: 'error' },
                cancelled: { color: 'gray', label: 'Đã hủy', badge: 'default' }
              };
              const config = statusConfig[reqStatus as keyof typeof statusConfig] || statusConfig.pending;

              return (
                <div
                  key={request._id}
                  className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-700 dark:bg-gray-800/50"
                >
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Employee Info */}
                    <div className="flex-shrink-0 lg:w-64">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                          <span className="text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-300">
                            {empName.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">
                            {empName}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                            {deptName}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Leave Details */}
                    <div className="flex-1 min-w-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Loại nghỉ</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {getLeaveTypeName(request.leaveType)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Thời gian</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDateRange(request.startDate, request.endDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Số ngày</p>
                          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {days} ngày
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Trạng thái</p>
                          <Badge color={config.badge as any}>{config.label}</Badge>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lý do</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {request.reason}
                        </p>
                      </div>

                      {/* Action Buttons - Only show for pending */}
                      {reqStatus === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(request._id)}
                            disabled={loading}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleReject(request._id)}
                            disabled={loading}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CloseIcon className="h-4 w-4" />
                            Từ chối
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ComponentCard>
    </>
  );
}
