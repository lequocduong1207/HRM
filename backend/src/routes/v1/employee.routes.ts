import { Router } from 'express';
import { EmployeeController } from '../../controllers/employee.controller.js';
import { protect } from '../../middlewares/auth/protect.middleware.js';
import { checkPermission, checkHierarchy, checkDepartmentAccess } from '../../middlewares/auth/rbac.middleware.js';
import { PERMISSIONS } from '../../config/permissions.js';

const router = Router();
const employeeController = new EmployeeController();
router.use(protect);

/**
 * @route   GET /api/v1/employees/overview
 * @desc    Lấy tổng quan nhân viên
 * @access  Private/Admin,HR
 */
router.get('/overview',
    /* #swagger.tags = ['Employees']
       #swagger.summary = 'Lấy tổng quan nhân viên'
       #swagger.description = 'Lấy thống kê tổng quan về nhân viên'
       #swagger.security = [{ "bearerAuth": [] }] */
    checkPermission(PERMISSIONS.EMPLOYEE.READ_ALL),
    employeeController.getOverview
);

/**
 * @route   GET /api/v1/employees/statistics/by-department
 * @desc    Lấy thống kê nhân viên theo phòng ban
 * @access  Private/Admin,HR
 */
router.get('/statistics/by-department',
    /* #swagger.tags = ['Employees']
       #swagger.summary = 'Thống kê nhân viên theo phòng ban'
       #swagger.description = 'Lấy thống kê số lượng nhân viên theo từng phòng ban'
       #swagger.security = [{ "bearerAuth": [] }] */
    checkPermission(PERMISSIONS.EMPLOYEE.READ_ALL),
    employeeController.getStatisticsByDepartment
);

/**
 * @route   GET /api/v1/employees/recent
 * @desc    Lấy nhân viên mới nhất
 * @access  Private/Admin,HR,Manager
 */
router.get('/recent',
    /* #swagger.tags = ['Employees']
       #swagger.summary = 'Nhân viên mới'
       #swagger.description = 'Lấy danh sách nhân viên mới nhất'
       #swagger.security = [{ "bearerAuth": [] }] */
    checkPermission([
        PERMISSIONS.EMPLOYEE.READ_ALL,
        PERMISSIONS.EMPLOYEE.READ_DEPT
    ]),
    employeeController.getRecentEmployees
);

/**
 * @route   GET /api/v1/employees/search
 * @desc    Tìm kiếm nhân viên
 * @access  Private/Admin,HR,Manager
 */
router.get('/search',
    /* #swagger.tags = ['Employees']
       #swagger.summary = 'Tìm kiếm nhân viên'
       #swagger.description = 'Tìm kiếm nhân viên theo tên, email, số điện thoại'
       #swagger.security = [{ "bearerAuth": [] }] */
    checkPermission([
        PERMISSIONS.EMPLOYEE.READ_ALL,
        PERMISSIONS.EMPLOYEE.READ_DEPT
    ]),
    employeeController.searchEmployees
);

/**
 * @route   GET /api/v1/employees/department/:departmentId
 * @desc    Lấy nhân viên theo phòng ban
 * @access  Private/Admin,HR,Manager
 */
router.get('/department/:departmentId',
    /* #swagger.tags = ['Employees']
       #swagger.summary = 'Nhân viên theo phòng ban'
       #swagger.description = 'Lấy tất cả nhân viên trong một phòng ban'
       #swagger.security = [{ "bearerAuth": [] }] */
    checkPermission([
        PERMISSIONS.EMPLOYEE.READ_ALL,
        PERMISSIONS.EMPLOYEE.READ_DEPT
    ]),
    checkDepartmentAccess(),
    employeeController.getEmployeesByDepartment
);

/**
 * @route   GET /api/v1/employees/:id
 * @desc    Lấy chi tiết nhân viên
 * @access  Private/Admin,HR,Manager,Self
 */
router.get('/:id',
    /* #swagger.tags = ['Employees']
       #swagger.summary = 'Chi tiết nhân viên'
       #swagger.description = 'Lấy thông tin chi tiết của một nhân viên'
       #swagger.security = [{ "bearerAuth": [] }] */
    checkPermission([
        PERMISSIONS.EMPLOYEE.READ_ALL,
        PERMISSIONS.EMPLOYEE.READ_DEPT,
        PERMISSIONS.EMPLOYEE.READ_SELF
    ]),
    employeeController.getEmployeeById
);

/**
 * @route   GET /api/v1/employees
 * @desc    Lấy tất cả nhân viên
 * @access  Private/Admin,HR,Manager
 */
router.get('/',
    /* #swagger.tags = ['Employees']
       #swagger.summary = 'Danh sách nhân viên'
       #swagger.description = 'Lấy tất cả nhân viên có lọc và phân trang'
       #swagger.security = [{ "bearerAuth": [] }] */
    checkPermission([
        PERMISSIONS.EMPLOYEE.READ_ALL,
        PERMISSIONS.EMPLOYEE.READ_DEPT
    ]),
    employeeController.getAllEmployees
);

/**
 * @route   POST /api/v1/employees
 * @desc    Tạo nhân viên mới
 * @access  Private/Admin,HR
 */
router.post('/',
    /* #swagger.tags = ['Employees']
       #swagger.summary = 'Tạo nhân viên mới'
       #swagger.description = 'Tạo một nhân viên mới'
       #swagger.security = [{ "bearerAuth": [] }] */
    checkPermission(PERMISSIONS.EMPLOYEE.CREATE),
    checkHierarchy(2), // HR Manager trở lên
    employeeController.createEmployee
);

/**
 * @route   PUT /api/v1/employees/:id
 * @desc    Cập nhật thông tin nhân viên
 * @access  Private/Admin,HR,Manager
 */
router.put('/:id',
    /* #swagger.tags = ['Employees']
       #swagger.summary = 'Cập nhật nhân viên'
       #swagger.description = 'Cập nhật thông tin nhân viên'
       #swagger.security = [{ "bearerAuth": [] }] */
    checkPermission([
        PERMISSIONS.EMPLOYEE.UPDATE,
        PERMISSIONS.EMPLOYEE.UPDATE_DEPT
    ]),
    checkDepartmentAccess(),
    employeeController.updateEmployee
);

/**
 * @route   PATCH /api/v1/employees/:id/status
 * @desc    Cập nhật trạng thái nhân viên
 * @access  Private/Admin,HR
 */
router.patch('/:id/status',
    /* #swagger.tags = ['Employees']
       #swagger.summary = 'Cập nhật trạng thái'
       #swagger.description = 'Cập nhật trạng thái làm việc của nhân viên'
       #swagger.security = [{ "bearerAuth": [] }] */
    checkPermission(PERMISSIONS.EMPLOYEE.UPDATE),
    checkHierarchy(2), // HR Manager trở lên
    employeeController.updateEmploymentStatus
);

/**
 * @route   DELETE /api/v1/employees/:id
 * @desc    Xóa nhân viên (soft delete)
 * @access  Private/Admin,HR
 */
router.delete('/:id',
    /* #swagger.tags = ['Employees']
       #swagger.summary = 'Xóa nhân viên'
       #swagger.description = 'Xóa mềm nhân viên (soft delete)'
       #swagger.security = [{ "bearerAuth": [] }] */
    checkPermission(PERMISSIONS.EMPLOYEE.DELETE),
    checkHierarchy(2), // HR Manager trở lên
    employeeController.deleteEmployee
);

export default router;
