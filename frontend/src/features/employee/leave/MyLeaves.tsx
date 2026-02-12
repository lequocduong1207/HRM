import { CalenderIcon, PlusIcon } from '../../../icons';
import { Link } from 'react-router';

export default function MyLeaves() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Nghỉ phép của tôi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý các đơn nghỉ phép của bạn
          </p>
        </div>
        <Link
          to="/employee/leave/new-request"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          <PlusIcon className="w-4 h-4" />
          Tạo đơn mới
        </Link>
      </div>

      {/* Empty State */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
        <CalenderIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Chưa có đơn nghỉ phép
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Bạn chưa có đơn nghỉ phép nào. Tạo đơn mới để bắt đầu.
        </p>
      </div>
    </div>
  );
}
