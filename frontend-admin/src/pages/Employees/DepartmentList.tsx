import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { TrashBinIcon } from "../../icons";
import type { IDepartment, CreateDepartmentRequest } from "../../types";
import { useDepartments } from "../../hooks/useDepartments";

export default function DepartmentList() {
  const { departments, loading, error, createDepartment, deleteDepartment, restoreDepartment } = useDepartments();
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'active' | 'deleted' | 'all'>('active');
  const [formData, setFormData] = useState<Partial<CreateDepartmentRequest>>({
    name: "",
    description: "",
  });
  
  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<IDepartment | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Employee list modal states
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<IDepartment | null>(null);
  const [departmentEmployees, setDepartmentEmployees] = useState<any[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const result = await createDepartment(formData as CreateDepartmentRequest);
      if (result.success) {
        setShowModal(false);
        setFormData({ name: "", description: "" });
      } else {
        alert('Lỗi: Không thể tạo phòng ban');
      }
    } catch (err) {
      alert(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter departments based on search term and status
  const filteredDepartments = departments.filter(dept => {
    const searchLower = searchTerm.toLowerCase();
    const managerName = typeof dept.managerId === 'string' ? '' : (dept.managerId?.fullName || '').toLowerCase();
    
    const matchesSearch = (
      dept.name.toLowerCase().includes(searchLower) ||
      (dept.description?.toLowerCase() || '').includes(searchLower) ||
      managerName.includes(searchLower)
    );

    const matchesStatus = 
      filterStatus === 'all' ? true :
      filterStatus === 'deleted' ? dept.isDeleted === true :
      dept.isDeleted !== true; // active

    return matchesSearch && matchesStatus;
  });

  const handleDeleteClick = (dept: IDepartment) => {
    setDepartmentToDelete(dept);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!departmentToDelete) return;
    
    try {
      setDeleting(true);
      const result = await deleteDepartment(departmentToDelete._id);
      
      if (result.success) {
        setShowDeleteModal(false);
        setDepartmentToDelete(null);
      } else {
        alert(`Lỗi: ${result.message || 'Không thể xóa phòng ban'}`);
      }
    } catch (err) {
      alert(`Lỗi: ${err}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleRestoreClick = async (dept: IDepartment) => {
    try {
      const result = await restoreDepartment(dept._id);
      if (!result.success) {
        alert(`Lỗi: ${result.message || 'Không thể khôi phục phòng ban'}`);
      }
    } catch (err) {
      alert(`Lỗi: ${err}`);
    }
  };

  const handleEmployeeCountClick = async (dept: IDepartment) => {
    setSelectedDepartment(dept);
    setShowEmployeeModal(true);
    setLoadingEmployees(true);
    setDepartmentEmployees([]);
    
    try {
      const { employeeService } = await import('../../api/employees.api');
      const employees = await employeeService.getEmployeesByDepartment(dept._id);
      setDepartmentEmployees(employees);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      alert('Không thể tải danh sách nhân viên');
    } finally {
      setLoadingEmployees(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 dark:text-gray-400">Đang tải danh sách phòng ban...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Lỗi: {error}</div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Quản lý phòng ban | HRM System"
        description="Quản lý danh sách phòng ban trong công ty"
      />
      <PageBreadcrumb pageTitle="Quản lý phòng ban" />

      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tổng số phòng ban
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {departments.length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tổng nhân viên
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {departments.reduce((sum, dept) => sum + (dept.employees?.length || 0), 0)}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              TB nhân viên/phòng
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {departments.length > 0
                ? Math.round(
                    departments.reduce((sum, dept) => sum + (dept.employees?.length || 0), 0) /
                      departments.length
                  )
                : 0}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Phòng ban lớn nhất
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {departments.length > 0
                ? departments.reduce(
                    (max, dept) =>
                      (dept.employees?.length || 0) > (max.employees?.length || 0) ? dept : max,
                    departments[0]
                  )?.name
                : "N/A"}
            </p>
          </div>
        </div>

        <ComponentCard title="Danh sách phòng ban">
          {/* Filter Tabs */}
          <div className="mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                filterStatus === 'active'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Đang hoạt động ({departments.filter(d => !d.isDeleted).length})
            </button>
            <button
              onClick={() => setFilterStatus('deleted')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                filterStatus === 'deleted'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Đã xóa ({departments.filter(d => d.isDeleted).length})
            </button>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Tất cả ({departments.length})
            </button>
          </div>

          {/* Actions */}
          <div className="mb-4 flex justify-between">
            <input
              type="text"
              placeholder="Tìm kiếm phòng ban..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <button
              onClick={() => setShowModal(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Thêm phòng ban
            </button>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Tên phòng ban
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Trưởng phòng
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Số nhân viên
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Mô tả
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Trạng thái
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                    >
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments.map((dept) => (
                    <TableRow
                      key={dept._id}
                      className="border-b border-gray-100 last:border-0 dark:border-white/[0.05]"
                    >
                      <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {dept.name}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {typeof dept.managerId === 'string' ? dept.managerId : dept.managerId?.fullName || 'Chưa có'}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        <button
                          onClick={() => handleEmployeeCountClick(dept)}
                          className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/60"
                        >
                          {dept.employeeCount || 0} người
                        </button>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {dept.description || 'N/A'}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        {dept.isDeleted ? (
                          <Badge color="error">Đã xóa</Badge>
                        ) : (
                          <Badge color="success">Hoạt động</Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {dept.isDeleted ? (
                            <button
                              onClick={() => handleRestoreClick(dept)}
                              className="rounded-lg px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/20"
                              title="Khôi phục"
                            >
                              Khôi phục
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteClick(dept)}
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                              title="Xóa"
                            >
                              <TrashBinIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ComponentCard>
      </div>

      {/* Add Department Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Thêm phòng ban mới
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Tên phòng ban <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  placeholder="Nhập tên phòng ban"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  placeholder="Mô tả về phòng ban"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Đang thêm...' : 'Thêm phòng ban'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && departmentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Xác nhận xóa phòng ban
            </h3>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
              Bạn có chắc chắn muốn xóa phòng ban <strong>{departmentToDelete.name}</strong>?
              <br />
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDepartmentToDelete(null);
                }}
                disabled={deleting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
              >
                {deleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee List Modal */}
      {showEmployeeModal && selectedDepartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Danh sách nhân viên - {selectedDepartment.name}
              </h3>
              <button
                onClick={() => {
                  setShowEmployeeModal(false);
                  setSelectedDepartment(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {loadingEmployees ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Đang tải danh sách nhân viên...</p>
                  </div>
                </div>
              ) : departmentEmployees.length > 0 ? (
                <div className="space-y-2">
                  {departmentEmployees.map((emp) => (
                    <div
                      key={emp._id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {emp.fullName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{emp.email}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{emp.position || 'N/A'}</p>
                      </div>
                      <Badge color={emp.isActive ? "success" : "error"}>
                        {emp.isActive ? "Đang làm việc" : "Ngừng làm việc"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Phòng ban chưa có nhân viên nào
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
