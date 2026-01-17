import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate } from "react-router";
import { useAddEmployeeLogic } from "../../hooks/useAddEmployeeLogic";

export default function AddEmployee() {
  const navigate = useNavigate();
  const {
    formData,
    handleChange,
    loading,
    error,
    success,
    departments,
    createAccount,
    setCreateAccount,
    accountData,
    setAccountData,
    handleSubmit
  } = useAddEmployeeLogic();

  return (
    <>
      <PageMeta
        title="Thêm nhân viên mới | HRM System"
        description="Thêm nhân viên mới vào hệ thống"
      />
      <PageBreadcrumb pageTitle="Thêm nhân viên mới" />

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
          {createAccount 
            ? '✓ Thêm nhân viên và tạo tài khoản đăng nhập thành công!' 
            : '✓ Thêm nhân viên thành công!'}
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
                  pattern="[0-9]{10,11}"
                  maxLength={11}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="0901234567"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  10-11 chữ số
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob ?? ""}
                    onChange={handleChange}
                    max={(() => {
                      const eighteenYearsAgo = new Date();
                      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
                      return eighteenYearsAgo.toISOString().split('T')[0];
                    })()}
                    min={(() => {
                      const sixtyFiveYearsAgo = new Date();
                      sixtyFiveYearsAgo.setFullYear(sixtyFiveYearsAgo.getFullYear() - 65);
                      return sixtyFiveYearsAgo.toISOString().split('T')[0];
                    })()}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Từ 18-65 tuổi
                  </p>
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
                  pattern="[0-9]{9}|[0-9]{12}"
                  maxLength={12}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Nhập số CMND/CCCD"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  9 số (CMND) hoặc 12 số (CCCD)
                </p>
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
                  <option value="">
                    {!departments || departments.length === 0 ? 'Đang tải phòng ban...' : 'Chọn phòng ban'}
                  </option>
                  {(departments || []).filter(dep => !dep.isDeleted).map(dep => (
                    <option key={dep._id} value={dep._id}>{dep.name}</option>
                  ))}
                </select>
                {departments && departments.filter(d => !d.isDeleted).length === 0 && (
                  <p className="mt-1 text-xs text-red-500">
                    Chưa có phòng ban nào. Vui lòng thêm phòng ban trước.
                  </p>
                )}
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
                  Ngày bắt đầu làm việc chính thức
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
                  min="0"
                  max="999999999"
                  step="100000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="15000000"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Ví dụ: 15,000,000 VNĐ
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Lưu ý:</strong> Thông tin lương sẽ được bảo mật và chỉ có quản trị viên mới có thể xem.
                </p>
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Account Information (Optional) */}
        <div className="mt-6">
          <ComponentCard 
            title="Tài khoản đăng nhập" 
            desc="Tạo tài khoản cho nhân viên để đăng nhập vào hệ thống"
          >
            <div className="space-y-4">
              {/* Checkbox to enable account creation */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="createAccount"
                  checked={createAccount}
                  onChange={(e) => setCreateAccount(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label 
                  htmlFor="createAccount" 
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tạo tài khoản đăng nhập cho nhân viên này
                </label>
              </div>

              {/* Account fields - only show if checkbox is checked */}
              {createAccount && (
                <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      ℹ️ Email nhân viên sẽ được dùng làm tên đăng nhập
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={accountData.password}
                      onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                      required={createAccount}
                      minLength={6}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Xác nhận mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={accountData.confirmPassword}
                      onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                      required={createAccount}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      placeholder="Nhập lại mật khẩu"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Vai trò <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={accountData.role}
                      onChange={(e) => setAccountData({ ...accountData, role: e.target.value as 'employee' | 'admin' })}
                      required={createAccount}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="employee">Nhân viên (Employee)</option>
                      <option value="admin">Quản trị viên (Admin)</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Vai trò sẽ quyết định quyền truy cập của nhân viên trong hệ thống
                    </p>
                  </div>
                </div>
              )}
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
            {loading ? 'Đang xử lý...' : 'Thêm nhân viên'}
          </button>
        </div>
      </form>
    </>
  );
}
