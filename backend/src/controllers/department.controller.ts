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
        const {
            searchTerm,
            page = 1,
            limit = 10,
            includeDeleted
        } = req.query;

        const result = await this.departmentService.getAllDepartments({
            searchTerm: searchTerm as string,
            page: Number(page),
            limit: Number(limit),
            includeDeleted: includeDeleted === 'true'
        }) as { data: any[], pagination: any };

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
        const departmentId = req.params.id;
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
        const departmentId = req.params.id;
        const department = await this.departmentService.updateDepartment(departmentId, req.body);

        res.status(200).json({
            success: true,
            message: 'Department updated successfully',
            data: department
        });
    });

    /**
     * @route   DELETE /api/v1/departments/:id
     * @desc    Xóa phòng ban (soft delete)
     * @access  Private/Admin
     */
    deleteDepartment = asyncHandler(async (req: Request, res: Response) => {
        const departmentId = req.params.id;
        await this.departmentService.deleteDepartment(departmentId);

        res.status(200).json({
            success: true,
            message: 'Department deleted successfully'
        });
    });

    /**
     * @route   PATCH /api/v1/departments/:id/restore
     * @desc    Khôi phục phòng ban đã xóa
     * @access  Private/Admin
     */
    restoreDepartment = asyncHandler(async (req: Request, res: Response) => {
        const departmentId = req.params.id;
        const department = await this.departmentService.restoreDepartment(departmentId);

        res.status(200).json({
            success: true,
            message: 'Department restored successfully',
            data: department
        });
    });

    /**
     * @route   POST /api/v1/departments/sync-employee-count
     * @desc    Đồng bộ lại số lượng nhân viên trong phòng ban
     * @access  Private/Admin
     */
    syncEmployeeCount = asyncHandler(async (req: Request, res: Response) => {
        const { departmentId } = req.body;
        const results = await this.departmentService.syncEmployeeCount(departmentId);

        res.status(200).json({
            success: true,
            message: 'Employee count synchronized successfully',
            data: results
        });
    });
}
