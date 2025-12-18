import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service.js';
import { asyncHandler } from '../middlewares/error/async-handler.middleware.js';

export class EmployeeController {
    private employeeService: EmployeeService;

    constructor() {
        this.employeeService = new EmployeeService();
    }

    /**
     * @route   GET /api/v1/employees
     * @desc    Lấy tất cả nhân viên (có filter và phân trang)
     * @access  Private
     */
    getAllEmployees = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Employees']
            #swagger.summary = 'Get all employees'
            #swagger.description = 'Get all employees with filtering and pagination'
        */
        const {
            searchTerm,
            departmentId,
            employmentStatus,
            page = 1,
            limit = 10
        } = req.query;

        const result = await this.employeeService.getAllEmployees({
            searchTerm: searchTerm as string,
            departmentId: departmentId ? Number(departmentId) : undefined,
            employmentStatus: employmentStatus as any,
            page: Number(page),
            limit: Number(limit)
        });

        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination
        });
    });

    /**
     * @route   GET /api/v1/employees/:id
     * @desc    Lấy nhân viên theo ID
     * @access  Private
     */
    getEmployeeById = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Employees']
            #swagger.summary = 'Get employee by ID'
            #swagger.description = 'Get detailed information of an employee'
        */
        const employeeId = parseInt(req.params.id);
        const employee = await this.employeeService.getEmployeeById(employeeId);

        res.status(200).json({
            success: true,
            data: employee
        });
    });

    /**
     * @route   POST /api/v1/employees
     * @desc    Tạo nhân viên mới
     * @access  Private/Admin
     */
    createEmployee = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Employees']
            #swagger.summary = 'Create new employee'
            #swagger.description = 'Create a new employee record'
        */
        const employee = await this.employeeService.createEmployee(req.body);

        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: employee
        });
    });

    /**
     * @route   PUT /api/v1/employees/:id
     * @desc    Cập nhật thông tin nhân viên
     * @access  Private/Admin
     */
    updateEmployee = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Employees']
            #swagger.summary = 'Update employee'
            #swagger.description = 'Update employee information'
        */
        const employeeId = parseInt(req.params.id);
        const employee = await this.employeeService.updateEmployee(employeeId, req.body);

        res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            data: employee
        });
    });

    /**
     * @route   PATCH /api/v1/employees/:id/status
     * @desc    Cập nhật trạng thái làm việc
     * @access  Private/Admin
     */
    updateEmploymentStatus = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Employees']
            #swagger.summary = 'Update employment status'
            #swagger.description = 'Update employee employment status'
        */
        const employeeId = parseInt(req.params.id);
        const { employmentStatus } = req.body;

        if (!employmentStatus) {
            return res.status(400).json({
                success: false,
                message: 'Employment status is required'
            });
        }

        const employee = await this.employeeService.updateEmploymentStatus(
            employeeId,
            employmentStatus
        );

        res.status(200).json({
            success: true,
            message: 'Employment status updated successfully',
            data: employee
        });
    });

    /**
     * @route   DELETE /api/v1/employees/:id
     * @desc    Xóa nhân viên (soft delete)
     * @access  Private/Admin
     */
    deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Employees']
            #swagger.summary = 'Delete employee'
            #swagger.description = 'Soft delete an employee'
        */
        const employeeId = parseInt(req.params.id);
        await this.employeeService.deleteEmployee(employeeId);

        res.status(200).json({
            success: true,
            message: 'Employee deleted successfully'
        });
    });

    /**
     * @route   GET /api/v1/employees/department/:departmentId
     * @desc    Lấy nhân viên theo phòng ban
     * @access  Private
     */
    getEmployeesByDepartment = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Employees']
            #swagger.summary = 'Get employees by department'
            #swagger.description = 'Get all employees in a specific department'
        */
        const departmentId = parseInt(req.params.departmentId);
        const { employmentStatus } = req.query;

        const employees = await this.employeeService.getEmployeesByDepartment(
            departmentId,
            employmentStatus as any
        );

        res.status(200).json({
            success: true,
            data: employees
        });
    });

    /**
     * @route   GET /api/v1/employees/statistics/by-department
     * @desc    Lấy thống kê nhân viên theo phòng ban
     * @access  Private/Admin
     */
    getStatisticsByDepartment = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Employees']
            #swagger.summary = 'Get employee statistics by department'
            #swagger.description = 'Get employee count and statistics grouped by department'
        */
        const statistics = await this.employeeService.getStatisticsByDepartment();

        res.status(200).json({
            success: true,
            data: statistics
        });
    });

    /**
     * @route   GET /api/v1/employees/recent
     * @desc    Lấy nhân viên mới nhất
     * @access  Private
     */
    getRecentEmployees = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Employees']
            #swagger.summary = 'Get recent employees'
            #swagger.description = 'Get list of recently hired employees'
        */
        const { limit = 5 } = req.query;
        const employees = await this.employeeService.getRecentEmployees(Number(limit));

        res.status(200).json({
            success: true,
            data: employees
        });
    });

    /**
     * @route   GET /api/v1/employees/birthdays
     * @desc    Lấy danh sách sinh nhật trong tháng
     * @access  Private
     */
    getBirthdaysInMonth = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Employees']
            #swagger.summary = 'Get employees birthdays'
            #swagger.description = 'Get list of employees with birthdays in specified month'
        */
        const { month, year } = req.query;
        
        const employees = await this.employeeService.getBirthdaysInMonth(
            month ? Number(month) : undefined,
            year ? Number(year) : undefined
        );

        res.status(200).json({
            success: true,
            data: employees
        });
    });

    /**
     * @route   GET /api/v1/employees/work-anniversaries
     * @desc    Lấy danh sách kỷ niệm làm việc sắp tới
     * @access  Private
     */
    getUpcomingWorkAnniversaries = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Employees']
            #swagger.summary = 'Get work anniversaries'
            #swagger.description = 'Get list of employees with upcoming work anniversaries'
        */
        const { month } = req.query;
        
        const anniversaries = await this.employeeService.getUpcomingWorkAnniversaries(
            month ? Number(month) : undefined
        );

        res.status(200).json({
            success: true,
            data: anniversaries
        });
    });

    /**
     * @route   GET /api/v1/employees/search
     * @desc    Tìm kiếm nhân viên
     * @access  Private
     */
    searchEmployees = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Employees']
            #swagger.summary = 'Search employees'
            #swagger.description = 'Search employees by name, email, phone, etc.'
        */
        const { q: searchTerm, page = 1, limit = 10 } = req.query;

        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                message: 'Search term (q) is required'
            });
        }

        const result = await this.employeeService.searchEmployees(
            searchTerm as string,
            Number(page),
            Number(limit)
        );

        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination
        });
    });

    /**
     * @route   GET /api/v1/employees/overview
     * @desc    Lấy tổng quan nhân viên
     * @access  Private/Admin
     */
    getOverview = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Employees']
            #swagger.summary = 'Get employee overview'
            #swagger.description = 'Get overview statistics of all employees'
        */
        const overview = await this.employeeService.getOverview();

        res.status(200).json({
            success: true,
            data: overview
        });
    });
}
