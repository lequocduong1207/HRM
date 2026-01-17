import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { PencilIcon, TrashBinIcon, LockIcon } from "../../icons";
import type { IUser, CreateUserRequest } from "../../types";
import { formatDate } from "../../utils";
import { useUsers } from "../../hooks/useUsers";

export default function UserManagement() {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUsers();
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [modalType, setModalType] = useState<"create" | "edit" | "password" | "delete">("create");
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [formData, setFormData] = useState<Partial<CreateUserRequest>>({
    email: "",
    password: "",
    fullName: "",
    role: "employee"
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge color="error">Quản trị viên</Badge>;
      case "employee":
        return <Badge color="info">Nhân viên</Badge>;
      default:
        return <Badge color="light">{role}</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge color="success">Hoạt động</Badge>
    ) : (
      <Badge color="error">Đã khóa</Badge>
    );
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setFormData({
      email: "",
      password: "",
      fullName: "",
      role: "employee"
    });
    setModalType("create");
    setShowModal(true);
  };

  const handleEditUser = (user: IUser) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      password: ""
    });
    setModalType("edit");
    setShowModal(true);
  };

  const handleResetPassword = (user: IUser) => {
    setSelectedUser(user);
    setFormData({ password: "" });
    setModalType("password");
    setShowModal(true);
  };

  const handleDeleteUser = (user: IUser) => {
    setSelectedUser(user);
    setModalType("delete");
    setShowModal(true);
  };

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      user.fullName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = async (user: IUser) => {
    try {
      // Tạm thời giữ nguyên vì chưa có trong hook
      const { userService } = await import('../../api/users.api');
      if (user.isActive) {
        await userService.deactivateUser(user._id);
      } else {
        await userService.activateUser(user._id);
      }
      // Tải lại từ hook
      window.location.reload();
    } catch (err) {
      alert(String(err));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      if (modalType === "create") {
        const result = await createUser(formData as CreateUserRequest);
        if (result.success) {
          setShowModal(false);
        } else {
          alert(result.message);
        }
      } else if (modalType === "edit" && selectedUser) {
        const result = await updateUser(selectedUser._id, formData);
        if (result.success) {
          setShowModal(false);
        } else {
          alert(result.message);
        }
      } else if (modalType === "password" && selectedUser && formData.password) {
        // Tạm thời giữ nguyên vì chưa có trong hook
        const { userService } = await import('../../api/users.api');
        const response = await userService.changePassword(selectedUser._id, formData.password);
        if (response.success || response) {
          alert("Mật khẩu đã được đổi thành công");
          setShowModal(false);
        }
      } else if (modalType === "delete" && selectedUser) {
        const result = await deleteUser(selectedUser._id);
        if (result.success) {
          setShowModal(false);
        } else {
          alert(result.message);
        }
      }
    } catch (err) {
      alert(String(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 dark:text-gray-400">Đang tải danh sách người dùng...</div>
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
        title="Quản lý người dùng | HRM System"
        description="Quản lý tài khoản và phân quyền người dùng"
      />
      <PageBreadcrumb pageTitle="Quản lý người dùng" />

      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:w-64"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Tất cả vai trò</option>
                <option value="admin">Quản trị viên</option>
                <option value="employee">Nhân viên</option>
              </select>
            </div>
            <button
              onClick={handleCreateUser}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Thêm tài khoản
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
                      ID
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Tên người dùng
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
                      className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                    >
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user._id}
                      className="border-b border-gray-100 last:border-0 dark:border-white/[0.05]"
                    >
                      <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        #{user._id.slice(-6).toUpperCase()}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.fullName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Tạo: {formatDate(user.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {user.email}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        {getStatusBadge(user.isActive)}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/20"
                            title="Chỉnh sửa"
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
                            onClick={() => handleToggleStatus(user)}
                            className="rounded-lg p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/20"
                            title={user.isActive ? "Khóa tài khoản" : "Kích hoạt"}
                          >
                            <LockIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                            title="Xóa tài khoản"
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
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-800">
            <form onSubmit={handleSubmit}>
              {modalType === "create" && (
                <>
                  <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Tạo tài khoản mới
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName || ""}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email || ""}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Mật khẩu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={formData.password || ""}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Vai trò <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.role || "employee"}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as "admin" | "employee" })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="employee">Nhân viên</option>
                        <option value="admin">Quản trị viên</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {modalType === "edit" && selectedUser && (
                <>
                  <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Chỉnh sửa tài khoản
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        value={formData.fullName || ""}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Vai trò
                      </label>
                      <select
                        value={formData.role || selectedUser.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as "admin" | "employee" })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="employee">Nhân viên</option>
                        <option value="admin">Quản trị viên</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {modalType === "password" && selectedUser && (
                <>
                  <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Đổi mật khẩu
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Người dùng: <strong>{selectedUser.fullName}</strong>
                    </p>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Mật khẩu mới <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={formData.password || ""}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {modalType === "delete" && selectedUser && (
                <>
                  <h3 className="mb-4 text-xl font-bold text-red-600 dark:text-red-400">
                    Xóa tài khoản
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bạn có chắc chắn muốn xóa tài khoản{" "}
                      <strong>{selectedUser.fullName}</strong> ({selectedUser.email})?
                    </p>
                    <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950/20">
                      <p className="text-sm text-red-800 dark:text-red-300">
                        ⚠️ Hành động này không thể hoàn tác!
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`rounded-lg px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${
                    modalType === "delete" ? "bg-red-600" : "bg-blue-600"
                  }`}
                >
                  {submitting
                    ? "Đang xử lý..."
                    : modalType === "create"
                    ? "Tạo tài khoản"
                    : modalType === "edit"
                    ? "Cập nhật"
                    : modalType === "password"
                    ? "Đổi mật khẩu"
                    : "Xác nhận xóa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
