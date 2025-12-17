import { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';
import { asyncHandler } from '../middlewares/error/async-handler.middleware.js';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    /**
     * @route   POST /api/v1/users
     * @desc    Tạo user mới (chỉ admin)
     * @access  Private/Admin
     */
    createUser = asyncHandler(async (req: Request, res: Response) => {
        const user = await this.userService.createUser(req.body);
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user
        });
    });

    /**
     * @route   GET /api/v1/users
     * @desc    Lấy tất cả users
     * @access  Private/Admin
     */
    getAllUsers = asyncHandler(async (req: Request, res: Response) => {
        const users = await this.userService.getAllUsers();
        
        res.status(200).json({
            success: true,
            data: users
        });
    });

    /**
     * @route   GET /api/v1/users/:id
     * @desc    Lấy user theo ID
     * @access  Private/Admin
     */
    getUserById = asyncHandler(async (req: Request, res: Response) => {
        const userId = parseInt(req.params.id);
        const user = await this.userService.getUserById(userId);
        
        res.status(200).json({
            success: true,
            data: user
        });
    });

    /**
     * @route   PUT /api/v1/users/:id
     * @desc    Cập nhật user
     * @access  Private/Admin
     */
    updateUser = asyncHandler(async (req: Request, res: Response) => {
        const userId = parseInt(req.params.id);
        const user = await this.userService.updateUser(userId, req.body);
        
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    });

    /**
     * @route   DELETE /api/v1/users/:id
     * @desc    Xóa user
     * @access  Private/Admin
     */
    deleteUser = asyncHandler(async (req: Request, res: Response) => {
        const userId = parseInt(req.params.id);
        await this.userService.deleteUser(userId);
        
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    });
}
