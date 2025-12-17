import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { PencilIcon, TrashBinIcon, LockIcon } from "../../icons";

interface UserAccount {
  id: number;
  employeeId: string;
  employeeName: string;
  username: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  createdDate: string;
}

export default function UserManagement() {
  const [users] = useState<UserAccount[]>([
    {
      id: 1,
      employeeId: "NV001",
      employeeName: "Nguyễn Văn A",
      username: "nguyenvana",
      email: "nguyenvana@company.com",
      role: "admin",
      status: "active",
      lastLogin: "15/12/2025 09:30",
      createdDate: "01/01/2023",
    },
    {
      id: 2,
      employeeId: "NV002",
      employeeName: "Trần Thị B",
      username: "tranthib",
      email: "tranthib@company.com",
      role: "manager",
      status: "active",
      lastLogin: "15/12/2025 08:45",
      createdDate: "15/03/2023",
    },
    {
      id: 3,
      employeeId: "NV003",
      employeeName: "Lê Văn C",
      username: "levanc",
      email: "levanc@company.com",
      role: "employee",
      status: "active",
      lastLogin: "14/12/2025 17:20",
      createdDate: "10/02/2023",
    },
    {
      id: 4,
      employeeId: "NV004",
      employeeName: "Phạm Thị D",
      username: "phamthid",
      email: "phamthid@company.com",
      role: "employee",
      status: "locked",
      lastLogin: "10/12/2025 15:00",
      createdDate: "20/04/2023",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [modalType, setModalType] = useState<"edit" | "password" | "delete">("edit");

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge color="error">Quản trị viên</Badge>;
      case "manager":
        return <Badge color="warning">Quản lý</Badge>;
      case "employee":
        return <Badge color="info">Nhân viên</Badge>;
      default:
        return <Badge color="light">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge color="success">Hoạt động</Badge>
    ) : (
      <Badge color="error">Đã khóa</Badge>
    );
  };

  const handleEditRole = (user: UserAccount) => {
    setSelectedUser(user);
    setModalType("edit");
    setShowModal(true);
  };

  const handleResetPassword = (user: UserAccount) => {
    setSelectedUser(user);
    setModalType("password");
    setShowModal(true);
  };

  return (
    <>
      <PageMeta
        title="Quản lý người dùng | HRM System"
        description="Quản lý tài khoản và phân quyền người dùng"
      />
      <PageBreadcrumb pageTitle="Quản lý người dùng" />

      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tổng tài khoản
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {users.length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quản trị viên
            </p>
            <p className="text-3xl font-bold text-red-600">
              {users.filter((u) => u.role === "admin").length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quản lý
            </p>
            <p className="text-3xl font-bold text-orange-600">
              {users.filter((u) => u.role === "manager").length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nhân viên
            </p>
            <p className="text-3xl font-bold text-blue-600">
              {users.filter((u) => u.role === "employee").length}
            </p>
          </div>
        </div>

        <ComponentCard title="Danh sách tài khoản">
          {/* Filters */}
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tìm kiếm tài khoản..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:w-64"
              />
              <select className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <option value="">Tất cả vai trò</option>
                <option value="admin">Quản trị viên</option>
                <option value="manager">Quản lý</option>
                <option value="employee">Nhân viên</option>
              </select>
            </div>
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
                      Mã NV
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Tên nhân viên
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Tên đăng nhập
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Email
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Vai trò
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Trạng thái
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Đăng nhập lần cuối
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
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-b border-gray-100 last:border-0 dark:border-white/[0.05]"
                    >
                      <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {user.employeeId}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.employeeName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Tạo: {user.createdDate}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {user.username}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {user.email}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {user.lastLogin}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditRole(user)}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/20"
                            title="Chỉnh sửa vai trò"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleResetPassword(user)}
                            className="rounded-lg p-2 text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950/20"
                            title="Đặt lại mật khẩu"
                          >
                            <LockIcon className="h-4 w-4" />
                          </button>
                          <button
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                            title="Khóa tài khoản"
                          >
                            <TrashBinIcon className="h-4 w-4" />
                          </button>
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

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-800">
            {modalType === "edit" && (
              <>
                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                  Chỉnh sửa vai trò
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nhân viên: <strong>{selectedUser.employeeName}</strong>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tài khoản: <strong>{selectedUser.username}</strong>
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Vai trò mới
                    </label>
                    <select
                      defaultValue={selectedUser.role}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="employee">Nhân viên (Employee)</option>
                      <option value="manager">Quản lý (Manager)</option>
                      <option value="admin">Quản trị viên (Admin)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {modalType === "password" && (
              <>
                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                  Đặt lại mật khẩu
                </h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản{" "}
                    <strong>{selectedUser.username}</strong>?
                  </p>
                  <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950/20">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      Mật khẩu mới sẽ được gửi qua email:{" "}
                      <strong>{selectedUser.email}</strong>
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  console.log("Action:", modalType, selectedUser);
                  setShowModal(false);
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                {modalType === "edit" ? "Cập nhật" : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
