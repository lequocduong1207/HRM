import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { useEditEmployeeLogic } from "../../hooks/useEditEmployeeLogic";

/**
 * EditEmployee Page - Presentation Component
 * Tất cả logic đã được tách ra useEditEmployeeLogic hook
 */
export default function EditEmployee() {
  const {
    formData,
    handleChange,
    departments,
    loading,
    loadingData,
    error,
    success,
    handleSubmit,
    navigate,
  } = useEditEmployeeLogic();

  if (loadingData) {
    return (
      <>
        <PageMeta
          title="Chỉnh sửa nhân viên | HRM System"
          description="Chỉnh sửa thông tin nhân viên"
        />
        <PageBreadcrumb pageTitle="Chỉnh sửa nhân viên" />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Chỉnh sửa nhân viên | HRM System"
        description="Chỉnh sửa thông tin nhân viên"
      />
      <PageBreadcrumb pageTitle="Chỉnh sửa nhân viên" />

      {/* Hiển thị trạng thái loading, error, success */}
      {loading && (
        <div className="mb-4 rounded bg-blue-100 px-4 py-2 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
          Đang xử lý, vui lòng chờ...
        </div>
      )}
      {error && (
        <div className="mb-4 rounded bg-red-100 px-4 py-2 text-red-700 dark:bg-red-900/40 dark:text-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded bg-green-100 px-4 py-2 text-green-700 dark:bg-green-900/40 dark:text-green-200">
          ✓ Cập nhật thông tin nhân viên thành công!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Thông tin cá nhân */}
          <ComponentCard title="Thông tin cá nhân" desc="Thông tin cơ bản của nhân viên">
            <div className="space-y-4">
              <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName ?? ""}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Nhập họ và tên"
                  />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email ?? ""} 
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone ?? ""}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="0901234567"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob ?? ""}
                  onChange={handleChange}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  min={new Date(new Date().setFullYear(new Date().getFullYear() - 65)).toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={formData.gender ?? ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  CMND/CCCD
                </label>
                <input
                  type="text"
                  name="nationalId"
                  value={formData.nationalId ?? ""}
                  onChange={handleChange}
                  maxLength={20}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Nhập số CMND/CCCD"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Địa chỉ
                </label>
                <textarea
                  name="address"
                  value={formData.address ?? ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Nhập địa chỉ"
                />
              </div>
            </div>
          </ComponentCard>

          {/* Thông tin công việc */}
          <ComponentCard title="Thông tin công việc" desc="Thông tin về công việc và chức vụ">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Phòng ban <span className="text-red-500">*</span>
                </label>
                <select
                  name="departmentId"
                  value={formData.departmentId ?? ""}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Chọn phòng ban</option>
                  {(departments || []).map(dep => (
                    <option key={dep._id} value={dep._id}>{dep.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Chức vụ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position ?? ""}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Ví dụ: Senior Developer"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Ngày vào làm <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="hireDate"
                  value={formData.hireDate ?? ""}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Lưu ý: Có thể chỉnh sửa ngày vào làm trong quá khứ
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Mức lương (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary ?? ""}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="15000000"
                />
              </div>

              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Lưu ý:</strong> Thông tin lương sẽ được bảo mật và chỉ có quản trị viên mới có thể xem.
                </p>
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/employees')}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {loading ? 'Đang xử lý...' : 'Cập nhật nhân viên'}
          </button>
        </div>
      </form>
    </>
  );
}
