import { Link, useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
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
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Tìm kiếm nhân viên..."
            />
            <Link
              to="/employees/add"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              + Thêm nhân viên mới
            </Link>
          </div>

          {/* Table */}
          <EmployeeTable
            employees={employees}
            onEdit={(id) => navigate(`/employees/edit/${id}`)}
            onDelete={deleteModal.open}
          />

          {/* Pagination Info */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Hiển thị 1 - {filteredCount} trong tổng số {totalCount} nhân viên
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                Trước
              </button>
              <button className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white">
                1
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                2
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                Sau
              </button>
            </div>
          </div>
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
