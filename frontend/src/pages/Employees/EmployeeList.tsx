import { Link, useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";
import { SearchInput } from "../../components/common/SearchInput";
import { DeleteConfirmationModal } from "../../components/common/DeleteConfirmationModal";
import { EmployeeTable } from "../../components/employees/EmployeeTable";
import { useEmployeeListLogic } from "../../hooks/useEmployeeListLogic";

/**
 * Employee List Page - Presentation Component
 * Logic được tách ra useEmployeeListLogic hook
 */
export default function EmployeeList() {
  const navigate = useNavigate();
  const {
    employees,
    totalCount,
    filteredCount,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    deleteModal,
  } = useEmployeeListLogic();

  // Loading state
  if (loading) {
    return <LoadingState message="Đang tải danh sách nhân viên..." />;
  }

  // Error state
  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <>
      <PageMeta
        title="Danh sách nhân viên | HRM System"
        description="Quản lý danh sách nhân viên trong công ty"
      />
      <PageBreadcrumb pageTitle="Danh sách nhân viên" />
      
      <div className="space-y-6">
        <ComponentCard title="Danh sách nhân viên">
          {/* Actions */}
          <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:justify-between">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Tìm kiếm nhân viên..."
            />
            <Link
              to="/employees/add"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 whitespace-nowrap"
            >
              + Thêm nhân viên mới
            </Link>
          </div>

          {/* Table */}
          {employees.length === 0 ? (
            <EmptyState
              title="Chưa có nhân viên nào"
              description="Bắt đầu bằng cách thêm nhân viên đầu tiên vào hệ thống quản lý nhân sự của bạn."
              icon={
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
          ) : (
            <>
              <EmployeeTable
                employees={employees}
                onEdit={(id) => navigate(`/admin/employees/edit/${id}`)}
                onDelete={deleteModal.open}
                onViewDetail={(id) => navigate(`/admin/employees/detail/${id}`)}
              />
              {/* Pagination Info */}
              <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 sm:justify-between">
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Hiển thị 1 - {filteredCount} trong tổng số {totalCount} nhân viên
                </div>
                <div className="flex gap-2">
                  <button className="rounded-lg border border-gray-300 px-2.5 sm:px-3 py-1 text-xs sm:text-sm hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                    Trước
                  </button>
                  <button className="rounded-lg bg-blue-600 px-2.5 sm:px-3 py-1 text-xs sm:text-sm text-white">
                    1
                  </button>
                  <button className="rounded-lg border border-gray-300 px-2.5 sm:px-3 py-1 text-xs sm:text-sm hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                    2
                  </button>
                  <button className="rounded-lg border border-gray-300 px-2.5 sm:px-3 py-1 text-xs sm:text-sm hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                    Sau
                  </button>
                </div>
              </div>
            </>
          )}
        </ComponentCard>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={deleteModal.show}
        title="Xác nhận xóa nhân viên"
        message={
          deleteModal.item ? (
            <>
              Bạn có chắc chắn muốn xóa nhân viên <strong>{deleteModal.item.fullName}</strong>?
              <br />
              Hành động này không thể hoàn tác.
            </>
          ) : ''
        }
        isDeleting={deleteModal.isDeleting}
        onConfirm={deleteModal.confirm}
        onCancel={deleteModal.close}
      />
    </>
  );
}
