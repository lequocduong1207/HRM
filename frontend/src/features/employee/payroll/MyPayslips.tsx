import { DollarLineIcon } from '../../../icons';

export default function MyPayslips() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Phiếu lương
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Xem và tải các phiếu lương của bạn
        </p>
      </div>

      {/* Empty State */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
        <DollarLineIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Không có phiếu lương
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Chức năng phiếu lương sẽ được tích hợp sau
        </p>
      </div>
    </div>
  );
}
