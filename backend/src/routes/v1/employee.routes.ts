import { Router } from 'express';
import { EmployeeController } from '../../controllers/employee.controller.js';
import { protect, admin } from '../../middlewares/auth/protect.middleware.js';

const router = Router();
const employeeController = new EmployeeController();

// ========================================
// PROTECTED ROUTES
// ========================================

router.use(protect);

/**
 * @route   GET /api/v1/employees/overview
 * @desc    Lấy tổng quan nhân viên
 * @access  Private/Admin
 */
router.get('/overview',
    /* 
        #swagger.tags = ['Employees']
        #swagger.path = '/employees/overview'
        #swagger.summary = 'Lấy tổng quan nhân viên'
        #swagger.description = 'Lấy thống kê tổng quan về nhân viên'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    admin,
    employeeController.getOverview
);

/**
 * @route   GET /api/v1/employees/statistics/by-department
 * @desc    Lấy thống kê nhân viên theo phòng ban
 * @access  Private/Admin
 */
router.get('/statistics/by-department',
    /* 
        #swagger.tags = ['Employees']
        #swagger.path = '/employees/statistics/by-department'
        #swagger.summary = 'Thống kê nhân viên theo phòng ban'
        #swagger.description = 'Lấy thống kê số lượng nhân viên theo từng phòng ban'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    admin,
    employeeController.getStatisticsByDepartment
);

/**
 * @route   GET /api/v1/employees/recent
 * @desc    Lấy nhân viên mới nhất
 * @access  Private
 */
router.get('/recent',
    /* 
        #swagger.tags = ['Employees']
        #swagger.path = '/employees/recent'
        #swagger.summary = 'Nhân viên mới'
        #swagger.description = 'Lấy danh sách nhân viên mới nhất'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    employeeController.getRecentEmployees
);

/**
 * @route   GET /api/v1/employees/birthdays
 * @desc    Lấy danh sách sinh nhật trong tháng
 * @access  Private
 */
router.get('/birthdays',
    /* 
        #swagger.tags = ['Employees']
        #swagger.path = '/employees/birthdays'
        #swagger.summary = 'Sinh nhật nhân viên'
        #swagger.description = 'Lấy danh sách nhân viên có sinh nhật trong tháng'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    employeeController.getBirthdaysInMonth
);

/**
 * @route   GET /api/v1/employees/work-anniversaries
 * @desc    Lấy danh sách kỷ niệm làm việc sắp tới
 * @access  Private
 */
router.get('/work-anniversaries',
    /* 
        #swagger.tags = ['Employees']
        #swagger.path = '/employees/work-anniversaries'
        #swagger.summary = 'Kỷ niệm làm việc'
        #swagger.description = 'Lấy danh sách kỷ niệm làm việc sắp tới'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    employeeController.getUpcomingWorkAnniversaries
);

/**
 * @route   GET /api/v1/employees/search
 * @desc    Tìm kiếm nhân viên
 * @access  Private
 */
router.get('/search',
    /* 
        #swagger.tags = ['Employees']
        #swagger.path = '/employees/search'
        #swagger.summary = 'Tìm kiếm nhân viên'
        #swagger.description = 'Tìm kiếm nhân viên theo tên, email, số điện thoại'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    employeeController.searchEmployees
);

/**
 * @route   GET /api/v1/employees/department/:departmentId
 * @desc    Lấy nhân viên theo phòng ban
 * @access  Private
 */
router.get('/department/:departmentId',
    /* 
        #swagger.tags = ['Employees']
        #swagger.path = '/employees/department/{departmentId}'
        #swagger.summary = 'Nhân viên theo phòng ban'
        #swagger.description = 'Lấy tất cả nhân viên trong một phòng ban'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    employeeController.getEmployeesByDepartment
);

/**
 * @route   GET /api/v1/employees/:id
 * @desc    Lấy nhân viên theo ID
 * @access  Private
 */
router.get('/:id',
    /* 
        #swagger.tags = ['Employees']
        #swagger.path = '/employees/{id}'
        #swagger.summary = 'Chi tiết nhân viên'
        #swagger.description = 'Lấy thông tin chi tiết của một nhân viên'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    employeeController.getEmployeeById
);

/**
 * @route   GET /api/v1/employees
 * @desc    Lấy tất cả nhân viên (có filter và phân trang)
 * @access  Private
 */
router.get('/',
    /* 
        #swagger.tags = ['Employees']
        #swagger.path = '/employees'
        #swagger.summary = 'Danh sách nhân viên'
        #swagger.description = 'Lấy tất cả nhân viên có lọc và phân trang'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    employeeController.getAllEmployees
);

/**
 * @route   POST /api/v1/employees
 * @desc    Tạo nhân viên mới
 * @access  Private/Admin
 */
router.post('/',
    /* 
        #swagger.tags = ['Employees']
        #swagger.path = '/employees'
        #swagger.summary = 'Tạo nhân viên mới'
        #swagger.description = 'Tạo một nhân viên mới'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    admin,
    employeeController.createEmployee
);

/**
 * @route   PUT /api/v1/employees/:id
 * @desc    Cập nhật thông tin nhân viên
 * @access  Private/Admin
 */
router.put('/:id',
    /* 
        #swagger.tags = ['Employees']
        #swagger.path = '/employees/{id}'
        #swagger.summary = 'Cập nhật nhân viên'
        #swagger.description = 'Cập nhật thông tin nhân viên'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    admin,
    employeeController.updateEmployee
);

/**
 * @route   PATCH /api/v1/employees/:id/status
 * @desc    Cập nhật trạng thái làm việc
 * @access  Private/Admin
 */
router.patch('/:id/status',
    /* 
        #swagger.tags = ['Employees']
        #swagger.path = '/employees/{id}/status'
        #swagger.summary = 'Cập nhật trạng thái'
        #swagger.description = 'Cập nhật trạng thái làm việc của nhân viên'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    admin,
    employeeController.updateEmploymentStatus
);

/**
 * @route   DELETE /api/v1/employees/:id
 * @desc    Xóa nhân viên (soft delete)
 * @access  Private/Admin
 */
router.delete('/:id',
    /* 
        #swagger.tags = ['Employees']
        #swagger.path = '/employees/{id}'
        #swagger.summary = 'Xóa nhân viên'
        #swagger.description = 'Xóa mềm nhân viên (soft delete)'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    admin,
    employeeController.deleteEmployee
);

export default router;