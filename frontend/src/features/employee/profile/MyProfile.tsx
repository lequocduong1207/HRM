import { useAuth } from '../../../context/AuthContext';
import { UserIcon, MailIcon, InfoIcon, BoxIcon, CalenderIcon, PencilIcon } from '../../../icons';
import { useState } from 'react';

export default function MyProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const employee = user?.employee;

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hồ sơ cá nhân
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý thông tin cá nhân của bạn
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <PencilIcon className="w-4 h-4" />
          Chỉnh sửa
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800"></div>

        {/* Avatar & Basic Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                <UserIcon className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left sm:mt-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {employee ? `${employee.firstName} ${employee.lastName}` : user?.fullName || 'N/A'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {employee?.position || 'Nhân viên'}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Thông tin liên hệ
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <MailIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium">{user?.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <InfoIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Số điện thoại</p>
                    <p className="font-medium">{employee?.phone || 'Chưa cập nhật'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Thông tin công việc
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <BoxIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phòng ban</p>
                    <p className="font-medium">Chưa cập nhật</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <CalenderIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ngày vào làm</p>
                    <p className="font-medium">{formatDate(employee?.hireDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Bảo mật
        </h3>
        <div className="space-y-3">
          <button className="w-full sm:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors">
            Đổi mật khẩu
          </button>
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 <span className="font-semibold">Lưu ý:</span> Để cập nhật thông tin cá nhân, vui lòng liên hệ với bộ phận nhân sự.
        </p>
      </div>
    </div>
  );
}
