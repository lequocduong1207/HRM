import { Request, Response } from 'express';
import { RoleService } from '../services/role.service.js';
import { asyncHandler } from '../middlewares/error/async-handler.middleware.js';
import { PERMISSIONS, ALL_PERMISSIONS } from '../config/permissions.js';

export class RoleController {
  private roleService: RoleService;

  constructor() {
    this.roleService = new RoleService();
  }

  /**
   * @route   GET /api/v1/roles
   * @desc    Lấy tất cả roles
   * @access  Private/Admin
   */
  getAllRoles = asyncHandler(async (req: Request, res: Response) => {
    const includeInactive = req.query.includeInactive === 'true';
    const includeSystemRoles = req.query.includeSystemRoles !== 'false';

    const roles = await this.roleService.getAllRoles({
      includeInactive,
      includeSystemRoles,
    });

    res.status(200).json({
      success: true,
      data: roles,
    });
  });

  /**
   * @route   GET /api/v1/roles/:id
   * @desc    Lấy role theo ID
   * @access  Private/Admin
   */
  getRoleById = asyncHandler(async (req: Request, res: Response) => {
    const role = await this.roleService.getRoleById(req.params.id);

    res.status(200).json({
      success: true,
      data: role,
    });
  });

  /**
   * @route   GET /api/v1/roles/name/:name
   * @desc    Lấy role theo tên
   * @access  Private/Admin
   */
  getRoleByName = asyncHandler(async (req: Request, res: Response) => {
    const role = await this.roleService.getRoleByName(req.params.name);

    res.status(200).json({
      success: true,
      data: role,
    });
  });

  /**
   * @route   POST /api/v1/roles
   * @desc    Tạo role mới
   * @access  Private/Admin
   */
  createRole = asyncHandler(async (req: Request, res: Response) => {
    const role = await this.roleService.createRole(req.body);

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: role,
    });
  });

  /**
   * @route   PUT /api/v1/roles/:id
   * @desc    Cập nhật role
   * @access  Private/Admin
   */
  updateRole = asyncHandler(async (req: Request, res: Response) => {
    const role = await this.roleService.updateRole(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: role,
    });
  });

  /**
   * @route   DELETE /api/v1/roles/:id
   * @desc    Xóa role
   * @access  Private/Admin
   */
  deleteRole = asyncHandler(async (req: Request, res: Response) => {
    const hardDelete = req.query.hard === 'true';
    await this.roleService.deleteRole(req.params.id, hardDelete);

    res.status(200).json({
      success: true,
      message: 'Role deleted successfully',
    });
  });

  /**
   * @route   GET /api/v1/roles/:id/permissions
   * @desc    Lấy permissions của role
   * @access  Private/Admin
   */
  getRolePermissions = asyncHandler(async (req: Request, res: Response) => {
    const permissions = await this.roleService.getRolePermissions(req.params.id);

    res.status(200).json({
      success: true,
      data: permissions,
    });
  });

  /**
   * @route   POST /api/v1/roles/:id/permissions
   * @desc    Thêm permissions vào role
   * @access  Private/Admin
   */
  addPermissions = asyncHandler(async (req: Request, res: Response) => {
    const { permissions } = req.body;
    const role = await this.roleService.addPermissionsToRole(req.params.id, permissions);

    res.status(200).json({
      success: true,
      message: 'Permissions added successfully',
      data: role,
    });
  });

  /**
   * @route   DELETE /api/v1/roles/:id/permissions
   * @desc    Xóa permissions khỏi role
   * @access  Private/Admin
   */
  removePermissions = asyncHandler(async (req: Request, res: Response) => {
    const { permissions } = req.body;
    const role = await this.roleService.removePermissionsFromRole(req.params.id, permissions);

    res.status(200).json({
      success: true,
      message: 'Permissions removed successfully',
      data: role,
    });
  });

  /**
   * @route   GET /api/v1/roles/:id/users/count
   * @desc    Lấy số lượng users theo role
   * @access  Private/Admin
   */
  getUserCount = asyncHandler(async (req: Request, res: Response) => {
    const count = await this.roleService.getRoleUserCount(req.params.id);

    res.status(200).json({
      success: true,
      data: { count },
    });
  });

  /**
   * @route   GET /api/v1/roles/system
   * @desc    Lấy system roles
   * @access  Private/Admin
   */
  getSystemRoles = asyncHandler(async (req: Request, res: Response) => {
    const roles = await this.roleService.getSystemRoles();

    res.status(200).json({
      success: true,
      data: roles,
    });
  });

  /**
   * @route   GET /api/v1/roles/custom
   * @desc    Lấy custom roles
   * @access  Private/Admin
   */
  getCustomRoles = asyncHandler(async (req: Request, res: Response) => {
    const roles = await this.roleService.getCustomRoles();

    res.status(200).json({
      success: true,
      data: roles,
    });
  });

  /**
   * @route   GET /api/v1/roles/permissions/all
   * @desc    Lấy tất cả available permissions
   * @access  Private/Admin
   */
  getAllPermissions = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: {
        permissions: ALL_PERMISSIONS,
        grouped: PERMISSIONS,
      },
    });
  });
}
