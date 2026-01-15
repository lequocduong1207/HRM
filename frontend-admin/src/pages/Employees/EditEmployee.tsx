import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { employeeService } from "../../api/employees.api";
import type { CreateEmployeeRequest } from "../../types";
import { getErrorMessage } from "../../utils";
import { useDepartments } from "../../hooks/useDepartments";
import { useEmployees } from "../../hooks/useEmployees";

export default function EditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [formData, setFormData] = useState<Partial<CreateEmployeeRequest>>({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    position: '',
    departmentId: '',
    salary: 0,
    hireDate: '',
  });
  
  const { departments, fetchDepartments } = useDepartments();
  const { updateEmployee } = useEmployees();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch employee data on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('ID nhân viên không hợp lệ');
        setLoadingData(false);
        return;
      }

      try {
        setLoadingData(true);
        
        // Fetch employee details
        const employee = await employeeService.getEmployeeById(id);
        
        // Pre-fill form with employee data
        setFormData({
          fullName: employee.fullName,
          email: employee.email,
          phoneNumber: employee.phoneNumber,
          dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().split('T')[0] : '',
          address: employee.address || '',
          position: employee.position,
          departmentId: typeof employee.departmentId === 'string' ? employee.departmentId : employee.departmentId._id,
          salary: employee.salary,
          hireDate: new Date(employee.hireDate).toISOString().split('T')[0],
        });
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(getErrorMessage(err));
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Validation functions
  const validateDateOfBirth = (dateOfBirth: string): string | null => {
    if (!dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    
    if (birthDate >= today) {
      return 'Ngày sinh phải nhỏ hơn ngày hiện tại';
    }
    
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
    
    if (actualAge < 18) {
      return 'Nhân viên phải từ 18 tuổi trở lên';
    }
    
    if (actualAge > 65) {
      return 'Nhân viên không được vượt quá 65 tuổi';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      setError('ID nhân viên không hợp lệ');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.fullName || !formData.email || !formData.phoneNumber || 
          !formData.departmentId || !formData.position || !formData.hireDate || !formData.salary) {
        throw new Error('Vui lòng điền đầy đủ các trường bắt buộc');
      }

      // Validate date of birth
      if (formData.dateOfBirth) {
        const dobError = validateDateOfBirth(formData.dateOfBirth);
        if (dobError) {
          throw new Error(dobError);
        }
      }

      // Update employee
      const result = await updateEmployee(id, formData as CreateEmployeeRequest);

      if (!result.success) {
        throw new Error(result.message || 'Không thể cập nhật nhân viên');
      }

      // Refresh departments để cập nhật số lượng nhân viên
      await fetchDepartments();

      setSuccess(true);
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/employees');
      }, 1500);
    } catch (err: any) {
      setError(getErrorMessage(err));
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
                  name="phoneNumber"
                  value={formData.phoneNumber ?? ""}
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
                  name="dateOfBirth"
                  value={formData.dateOfBirth ?? ""}
                  onChange={handleChange}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  min={new Date(new Date().setFullYear(new Date().getFullYear() - 65)).toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
                  {departments.map(dep => (
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
