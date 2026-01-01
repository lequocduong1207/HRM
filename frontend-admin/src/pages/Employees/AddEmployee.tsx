import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { useState } from "react";
import { departmentService } from "../../api/departments.api.js";

export default function AddEmployee() {
  interface Employee {
    employeeId: string;
    fullName: string;
    dob: Date | null;
    gender: "Male" | "Female" | "Other" | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    nationalId: string | null;         
    departmentId: number | null;
    position: string | null;
    hireDate: Date | null;
    employmentStatus: 'active' | 'inactive' | 'terminated' | 'resigned';
    createdAt: Date;
    updatedAt: Date;
  }

  interface Department {
    departmentId: number;
    name: string;
    description: string | null;
    managerId: number | null;
    managerName: string | null;  
    employeeCount: number;        
    createdAt: Date;
    updatedAt: Date;
  }

  const [formData, setFormData] = useState<Partial<Employee>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

      // Lấy danh sách phòng ban từ API khi mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await departmentService.getAllDepartments();
        if (!Array.isArray(res)) throw new Error("Không lấy được danh sách phòng ban");
        setDepartments(res);
      } catch (err) {
        setDepartments([]);
      }
    };
    fetchDepartments();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Đã xảy ra lỗi khi thêm nhân viên.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
          Thêm nhân viên thành công!
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob ? ""}
                    onChange={handleChange}
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
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
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
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Phòng ban <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="departmentId"
                    value={formData.departmentId ?? ""}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        departmentId: e.target.value ? Number(e.target.value) : null
                      })
                    }
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Chọn phòng ban</option>
                    {departments.map(dep => (
                      <option key={dep.departmentId} value={dep.departmentId}>{dep.name}</option>
                    ))}
                  </select>
                      <option value="">Chọn phòng ban</option>
                      {departments.map(dep => (
                        <option key={dep.id} value={dep.id}>{dep.name}</option>
                      ))}
                    </select>
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Ví dụ: Senior Developer"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Loại hợp đồng <span className="text-red-500">*</span>
                </label>
                <select
                  name="employeeType"
                  value={formData.employeeType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="fulltime">Toàn thời gian</option>
                  <option value="parttime">Bán thời gian</option>
                  <option value="contract">Hợp đồng</option>
                  <option value="intern">Thực tập sinh</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Ngày vào làm <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Mức lương (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
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

          {/* Account Information */}
          <ComponentCard title="Thông tin tài khoản" desc="Tạo tài khoản đăng nhập cho nhân viên">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="createAccount"
                  checked={formData.createAccount}
                  onChange={(e) =>
                    setFormData({ ...formData, createAccount: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="createAccount"
                  className="text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tạo tài khoản đăng nhập cho nhân viên
                </label>
              </div>

              {formData.createAccount && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Tên đăng nhập <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required={formData.createAccount}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      placeholder="Ví dụ: nguyenvana"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required={formData.createAccount}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      placeholder="Tối thiểu 8 ký tự"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Vai trò <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required={formData.createAccount}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="employee">Nhân viên (Employee)</option>
                      <option value="manager">Quản lý (Manager)</option>
                      <option value="admin">Quản trị viên (Admin)</option>
                    </select>
                    <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <p>• <strong>Nhân viên:</strong> Xem thông tin cá nhân, chấm công, gửi đơn nghỉ phép</p>
                      <p>• <strong>Quản lý:</strong> Quản lý nhân viên trong phòng ban, duyệt đơn nghỉ phép</p>
                      <p>• <strong>Quản trị viên:</strong> Toàn quyền quản lý hệ thống</p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
                    <p className="text-sm text-green-800 dark:text-green-300">
                      <strong>Thông tin đăng nhập:</strong> Sau khi tạo, hệ thống sẽ gửi thông tin đăng nhập qua email cho nhân viên.
                    </p>
                  </div>
                </>
              )}
            </div>
          </ComponentCard>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Thêm nhân viên
          </button>
        </div>
      </form>
    </>
  );
}
