import { Request, Response, NextFunction } from 'express';
import { AppError } from '../error/error-handler.middleware.js';
import { asyncHandler } from '../error/async-handler.middleware.js';
import { Role } from '../../models/role.model.js';

/**
 * Extended Request interface với role info
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role?: string;      // DEPRECATED - backward compatibility
        roleId: string;
        departmentId?: string;
      };
      userRole?: typeof Role.prototype;
      permissions?: string[];
    }
  }
}

/**
 * Middleware: Check if user has specific permission(s)
 * Usage: checkPermission('employee:create')
 *        checkPermission(['employee:create', 'employee:read:all'])
 */
export const checkPermission = (requiredPermissions: string | string[]) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roleId) {
      throw new AppError('Not authenticated', 401);
    }

    // Lấy role từ database
    const role = await Role.findById(req.user.roleId);
    
    if (!role) {
      throw new AppError('Invalid role', 403);
    }

    if (!role.isActive) {
      throw new AppError('Role is inactive', 403);
    }

    // Attach role và permissions vào request
    req.userRole = role;
    req.permissions = role.getAllPermissions();

    // Kiểm tra permission
    const permissions = Array.isArray(requiredPermissions) 
      ? requiredPermissions 
      : [requiredPermissions];

    const hasPermission = permissions.some(permission => 
      role.hasPermission(permission)
    );

    if (!hasPermission) {
      throw new AppError(
        `Insufficient permissions. Required one of: ${permissions.join(', ')}`,
        403
      );
    }

    next();
  });
};

/**
 * Middleware: Check if user has ALL specified permissions
 * Usage: checkAllPermissions(['employee:create', 'employee:update'])
 */
export const checkAllPermissions = (requiredPermissions: string[]) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roleId) {
      throw new AppError('Not authenticated', 401);
    }

    const role = await Role.findById(req.user.roleId);
    
    if (!role || !role.isActive) {
      throw new AppError('Invalid or inactive role', 403);
    }

    req.userRole = role;
    req.permissions = role.getAllPermissions();

    const hasAllPermissions = role.hasAllPermissions(requiredPermissions);

    if (!hasAllPermissions) {
      const missingPermissions = requiredPermissions.filter(
        permission => !role.hasPermission(permission)
      );
      
      throw new AppError(
        `Insufficient permissions. Missing: ${missingPermissions.join(', ')}`,
        403
      );
    }

    next();
  });
};

/**
 * Middleware: Check user hierarchy level
 * Chỉ cho phép user với hierarchy <= maxHierarchy
 * Hierarchy càng thấp càng có quyền cao (admin = 1)
 * 
 * Usage: checkHierarchy(2)  // Chỉ admin và hr_manager
 */
export const checkHierarchy = (maxHierarchy: number) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roleId) {
      throw new AppError('Not authenticated', 401);
    }

    const role = await Role.findById(req.user.roleId);
    
    if (!role || !role.isActive) {
      throw new AppError('Invalid or inactive role', 403);
    }

    req.userRole = role;

    if (role.hierarchy > maxHierarchy) {
      throw new AppError(
        `Access denied. Required role level: ${maxHierarchy} or higher (current: ${role.hierarchy})`,
        403
      );
    }

    next();
  });
};

/**
 * Middleware: Check department access
 * Department manager chỉ có thể truy cập department của mình
 * Admin và HR Manager có full access
 * 
 * Usage: checkDepartmentAccess()
 */
export const checkDepartmentAccess = () => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roleId) {
      throw new AppError('Not authenticated', 401);
    }

    // Nếu chưa load role, load ngay
    if (!req.userRole) {
      const role = await Role.findById(req.user.roleId);
      if (!role || !role.isActive) {
        throw new AppError('Invalid or inactive role', 403);
      }
      req.userRole = role;
    }

    const role = req.userRole;

    // Admin (hierarchy 1) và HR Manager (hierarchy 2) có full access
    if (role.hierarchy <= 2) {
      return next();
    }

    // Department Manager (hierarchy 3) và Employee (hierarchy 4)
    // Kiểm tra department access
    const targetDepartmentId = req.params.departmentId || 
                               req.body.departmentId || 
                               req.query.departmentId;

    // Nếu không có departmentId trong request, allow (sẽ filter ở service layer)
    if (!targetDepartmentId) {
      return next();
    }

    // Kiểm tra user có departmentId không
    if (!req.user.departmentId) {
      throw new AppError('User does not belong to any department', 403);
    }

    // So sánh departmentId
    if (targetDepartmentId !== req.user.departmentId.toString()) {
      throw new AppError(
        'Access denied. You can only access your own department',
        403
      );
    }

    next();
  });
};

/**
 * Middleware: Check resource ownership
 * Cho phép user chỉ truy cập resource của chính họ
 * Admin và HR có thể bypass
 * 
 * Usage: checkOwnership('userId')  // check req.params.userId === req.user.userId
 */
export const checkOwnership = (userIdParam: string = 'userId') => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roleId) {
      throw new AppError('Not authenticated', 401);
    }

    // Load role nếu chưa có
    if (!req.userRole) {
      const role = await Role.findById(req.user.roleId);
      if (!role || !role.isActive) {
        throw new AppError('Invalid or inactive role', 403);
      }
      req.userRole = role;
    }

    const role = req.userRole;

    // Admin và HR Manager có full access
    if (role.hierarchy <= 2) {
      return next();
    }

    // Kiểm tra ownership
    const targetUserId = req.params[userIdParam] || 
                        req.body[userIdParam] || 
                        req.query[userIdParam];

    if (!targetUserId) {
      throw new AppError('Target user ID not specified', 400);
    }

    if (targetUserId !== req.user.userId) {
      throw new AppError(
        'Access denied. You can only access your own resources',
        403
      );
    }

    next();
  });
};

/**
 * Middleware: Check if user can manage target user
 * Chỉ cho phép manage user có hierarchy thấp hơn
 * Admin có thể manage tất cả
 * 
 * Usage: checkCanManageUser()
 */
export const checkCanManageUser = () => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roleId) {
      throw new AppError('Not authenticated', 401);
    }

    // Load current user role
    const currentRole = await Role.findById(req.user.roleId);
    if (!currentRole || !currentRole.isActive) {
      throw new AppError('Invalid or inactive role', 403);
    }

    req.userRole = currentRole;

    // Admin có thể manage tất cả
    if (currentRole.hierarchy === 1) {
      return next();
    }

    // Lấy target user ID
    const targetUserId = req.params.id || req.params.userId;
    if (!targetUserId) {
      throw new AppError('Target user ID not specified', 400);
    }

    // Load target user để lấy role
    const { User } = await import('../../models/user.model.js');
    const targetUser = await User.findById(targetUserId);
    
    if (!targetUser) {
      throw new AppError('Target user not found', 404);
    }

    const targetRole = await Role.findById(targetUser.roleId);
    if (!targetRole) {
      throw new AppError('Target user has invalid role', 400);
    }

    // Chỉ có thể manage user có hierarchy cao hơn (số lớn hơn)
    if (targetRole.hierarchy <= currentRole.hierarchy) {
      throw new AppError(
        `Cannot manage user with equal or higher role level`,
        403
      );
    }

    next();
  });
};

/**
 * Helper: Attach role to request
 * Useful khi muốn attach role sớm để reuse
 */
export const attachRole = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roleId) {
      return next();
    }

    const role = await Role.findById(req.user.roleId);
    if (role && role.isActive) {
      req.userRole = role;
      req.permissions = role.getAllPermissions();
    }

    next();
  }
);
