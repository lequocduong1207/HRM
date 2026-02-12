import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';

export default function Unauthorized() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">403</h1>
        <p className="mb-4 text-3xl font-semibold text-gray-700 dark:text-gray-300">
          Không có quyền truy cập
        </p>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Xin lỗi, bạn không có quyền truy cập vào trang này.
        </p>
        
        {user && (
          <div className="mb-8 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              Bạn đang đăng nhập với vai trò: <strong>{user.role}</strong>
            </p>
          </div>
        )}

        <Link
          to={user?.role === 'employee' ? '/employee' : '/admin'}
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
}
