import { Request, Response } from 'express';
import { DepartmentService } from '../services/department.service.js';
import { asyncHandler } from '../middlewares/error/async-handler.middleware.js';

export class DepartmentController {
    private departmentService: DepartmentService;

    constructor() {
        this.departmentService = new DepartmentService();
    }

    /**
     * @route   GET /api/v1/departments
     * @desc    Lấy tất cả phòng ban (có phân trang)
     * @access  Private
     */
    getAllDepartments = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Departments']
            #swagger.summary = 'Get all departments'
            #swagger.description = 'Get all departments with pagination'
        */
        const {
            searchTerm,
            page = 1,
            limit = 10
        } = req.query;

        const result = await this.departmentService.getAllDepartments({
            searchTerm: searchTerm as string,
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
     * @route   GET /api/v1/departments/simple
     * @desc    Lấy tất cả phòng ban (không phân trang) cho dropdown
     * @access  Private
     */
    getAllSimple = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Departments']
            #swagger.summary = 'Get all departments (simple)'
            #swagger.description = 'Get all departments without pagination for dropdown'
        */
        const departments = await this.departmentService.getAllSimple();

        res.status(200).json({
            success: true,
            data: departments
        });
    });

    /**
     * @route   GET /api/v1/departments/statistics
     * @desc    Lấy thống kê nhân viên theo phòng ban
     * @access  Private/Admin
     */
    getStatistics = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Departments']
            #swagger.summary = 'Get department statistics'
            #swagger.description = 'Get employee statistics by department'
        */
        const statistics = await this.departmentService.getStatistics();

        res.status(200).json({
            success: true,
            data: statistics
        });
    });

    /**
     * @route   GET /api/v1/departments/:id
     * @desc    Lấy phòng ban theo ID
     * @access  Private
     */
    getDepartmentById = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Departments']
            #swagger.summary = 'Get department by ID'
            #swagger.description = 'Get detailed information of a department'
        */
        const departmentId = parseInt(req.params.id);
        const department = await this.departmentService.getDepartmentById(departmentId);

        res.status(200).json({
            success: true,
            data: department
        });
    });

    /**
     * @route   POST /api/v1/departments
     * @desc    Tạo phòng ban mới
     * @access  Private/Admin
     */
    createDepartment = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Departments']
            #swagger.summary = 'Create new department'
            #swagger.description = 'Create a new department'
        */
        const department = await this.departmentService.createDepartment(req.body);

        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            data: department
        });
    });

    /**
     * @route   PUT /api/v1/departments/:id
     * @desc    Cập nhật thông tin phòng ban
     * @access  Private/Admin
     */
    updateDepartment = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Departments']
            #swagger.summary = 'Update department'
            #swagger.description = 'Update department information'
        */
        const departmentId = parseInt(req.params.id);
        const department = await this.departmentService.updateDepartment(departmentId, req.body);

        res.status(200).json({
            success: true,
            message: 'Department updated successfully',
            data: department
        });
    });

    /**
     * @route   DELETE /api/v1/departments/:id
     * @desc    Xóa phòng ban
     * @access  Private/Admin
     */
    deleteDepartment = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Departments']
            #swagger.summary = 'Delete department'
            #swagger.description = 'Delete a department'
        */
        const departmentId = parseInt(req.params.id);
        await this.departmentService.deleteDepartment(departmentId);

        res.status(200).json({
            success: true,
            message: 'Department deleted successfully'
        });
    });
}
