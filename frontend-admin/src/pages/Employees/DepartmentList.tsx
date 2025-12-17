import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { PencilIcon, TrashBinIcon } from "../../icons";

interface Department {
  id: number;
  name: string;
  manager: string;
  employeeCount: number;
  description: string;
  status: string;
}

export default function DepartmentList() {
  const [departments] = useState<Department[]>([
    {
      id: 1,
      name: "Phát triển phần mềm",
      manager: "Nguyễn Văn A",
      employeeCount: 45,
      description: "Phòng phát triển và bảo trì các sản phẩm phần mềm",
      status: "Active",
    },
    {
      id: 2,
      name: "Nhân sự",
      manager: "Trần Thị B",
      employeeCount: 8,
      description: "Quản lý nhân sự, tuyển dụng và đào tạo",
      status: "Active",
    },
    {
      id: 3,
      name: "Kế toán",
      manager: "Lê Văn C",
      employeeCount: 12,
      description: "Quản lý tài chính và kế toán công ty",
      status: "Active",
    },
    {
      id: 4,
      name: "Marketing",
      manager: "Phạm Thị D",
      employeeCount: 18,
      description: "Tiếp thị và quảng bá sản phẩm",
      status: "Active",
    },
    {
      id: 5,
      name: "Kinh doanh",
      manager: "Hoàng Văn E",
      employeeCount: 22,
      description: "Phát triển khách hàng và chăm sóc khách hàng",
      status: "Active",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
    setShowModal(false);
    // TODO: Call API to create department
  };

  return (
    <>
      <PageMeta
        title="Quản lý phòng ban | HRM System"
        description="Quản lý danh sách phòng ban trong công ty"
      />
      <PageBreadcrumb pageTitle="Quản lý phòng ban" />

      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tổng số phòng ban
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {departments.length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tổng nhân viên
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {departments.reduce((sum, dept) => sum + dept.employeeCount, 0)}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              TB nhân viên/phòng
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {Math.round(
                departments.reduce((sum, dept) => sum + dept.employeeCount, 0) /
                  departments.length
              )}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Phòng ban lớn nhất
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {
                departments.reduce((max, dept) =>
                  dept.employeeCount > max.employeeCount ? dept : max
                ).name
              }
            </p>
          </div>
        </div>

        <ComponentCard title="Danh sách phòng ban">
          {/* Actions */}
          <div className="mb-4 flex justify-between">
            <input
              type="text"
              placeholder="Tìm kiếm phòng ban..."
              className="w-64 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <button
              onClick={() => setShowModal(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Thêm phòng ban
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
                      Tên phòng ban
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Trưởng phòng
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Số nhân viên
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Mô tả
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
                  {departments.map((dept) => (
                    <TableRow
                      key={dept.id}
                      className="border-b border-gray-100 last:border-0 dark:border-white/[0.05]"
                    >
                      <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {dept.name}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {dept.manager}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {dept.employeeCount} người
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {dept.description}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Badge color="success">Hoạt động</Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="rounded-lg p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/20">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20">
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

      {/* Add Department Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Thêm phòng ban mới
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Tên phòng ban <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  placeholder="Nhập tên phòng ban"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Trưởng phòng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.manager}
                  onChange={(e) =>
                    setFormData({ ...formData, manager: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  placeholder="Chọn trưởng phòng"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  placeholder="Mô tả về phòng ban"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  Thêm phòng ban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
