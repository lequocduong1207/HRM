import { Types } from 'mongoose';
import { RoleRepository } from '../repositories/role.repository.js';
import { IRole, IPermission } from '../models/role.model.js';
import { AppError } from '../middlewares/error/error-handler.middleware.js';
import { groupPermissionsByResource } from '../config/permissions.js';

export class RoleService {
  private roleRepository: RoleRepository;

  constructor() {
    this.roleRepository = new RoleRepository();
  }

  /**
   * Tạo role mới
   */
  async createRole(data: {
    name: string;
    displayName: string;
    description: string;
    permissions: string[] | IPermission[];
    hierarchy: number;
    isSystemRole?: boolean;
  }): Promise<IRole> {
    // Validate
    if (!data.name || !data.displayName || !data.description) {
      throw new AppError('Name, displayName, and description are required', 400);
    }

    // Kiểm tra tên đã tồn tại
    const nameExists = await this.roleRepository.nameExists(data.name);
    if (nameExists) {
      throw new AppError('Role name already exists', 400);
    }

    // Validate hierarchy
    if (data.hierarchy < 1 || data.hierarchy > 100) {
      throw new AppError('Hierarchy must be between 1 and 100', 400);
    }

    // Convert permissions nếu là array of strings
    let permissions: IPermission[];
    if (data.permissions.length > 0 && typeof data.permissions[0] === 'string') {
      permissions = groupPermissionsByResource(data.permissions as string[]);
    } else {
      permissions = data.permissions as IPermission[];
    }

    // Tạo role
    const role = await this.roleRepository.create({
      name: data.name.toLowerCase(),
      displayName: data.displayName,
      description: data.description,
      permissions,
      hierarchy: data.hierarchy,
      isSystemRole: data.isSystemRole || false,
      isActive: true,
    });

    return role;
  }

  /**
   * Lấy tất cả roles
   */
  async getAllRoles(options?: {
    includeInactive?: boolean;
    includeSystemRoles?: boolean;
  }): Promise<IRole[]> {
    const roles = await this.roleRepository.findAll({
      includeInactive: options?.includeInactive,
      sortBy: 'hierarchy',
      sortOrder: 'asc',
    });

    if (options?.includeSystemRoles === false) {
      return roles.filter(role => !role.isSystemRole);
    }

    return roles;
  }

  /**
   * Lấy role theo ID
   */
  async getRoleById(roleId: string): Promise<IRole> {
    if (!Types.ObjectId.isValid(roleId)) {
      throw new AppError('Invalid role ID', 400);
    }

    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new AppError('Role not found', 404);
    }

    return role;
  }

  /**
   * Lấy role theo tên
   */
  async getRoleByName(name: string): Promise<IRole> {
    const role = await this.roleRepository.findByName(name);
    if (!role) {
      throw new AppError('Role not found', 404);
    }

    return role;
  }

  /**
   * Cập nhật role
   */
  async updateRole(
    roleId: string,
    data: {
      displayName?: string;
      description?: string;
      permissions?: string[] | IPermission[];
      hierarchy?: number;
      isActive?: boolean;
    }
  ): Promise<IRole> {
    if (!Types.ObjectId.isValid(roleId)) {
      throw new AppError('Invalid role ID', 400);
    }

    // Kiểm tra role tồn tại
    const existingRole = await this.roleRepository.findById(roleId);
    if (!existingRole) {
      throw new AppError('Role not found', 404);
    }

    // Không cho phép sửa system role (trừ isActive)
    if (existingRole.isSystemRole) {
      const allowedFields = ['isActive'];
      const attemptedFields = Object.keys(data);
      const unauthorizedFields = attemptedFields.filter(
        field => !allowedFields.includes(field)
      );

      if (unauthorizedFields.length > 0) {
        throw new AppError(
          `Cannot modify system role. Only 'isActive' can be changed`,
          403
        );
      }
    }

    // Validate hierarchy nếu có
    if (data.hierarchy !== undefined) {
      if (data.hierarchy < 1 || data.hierarchy > 100) {
        throw new AppError('Hierarchy must be between 1 and 100', 400);
      }
    }

    // Convert permissions nếu cần
    const updateData: any = { ...data };
    if (data.permissions) {
      if (data.permissions.length > 0 && typeof data.permissions[0] === 'string') {
        updateData.permissions = groupPermissionsByResource(data.permissions as string[]);
      }
    }

    // Cập nhật
    const updatedRole = await this.roleRepository.update(roleId, updateData);
    if (!updatedRole) {
      throw new AppError('Failed to update role', 500);
    }

    return updatedRole;
  }

  /**
   * Xóa role
   */
  async deleteRole(roleId: string, hardDelete: boolean = false): Promise<void> {
    if (!Types.ObjectId.isValid(roleId)) {
      throw new AppError('Invalid role ID', 400);
    }

    // Kiểm tra role tồn tại
    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new AppError('Role not found', 404);
    }

    // Không cho phép xóa system role
    if (role.isSystemRole) {
      throw new AppError('Cannot delete system role', 403);
    }

    // Kiểm tra role có đang được sử dụng không
    const isInUse = await this.roleRepository.isRoleInUse(roleId);
    if (isInUse) {
      const userCount = await this.roleRepository.getUserCountByRole(roleId);
      throw new AppError(
        `Cannot delete role. It is currently assigned to ${userCount} user(s)`,
        400
      );
    }

    // Xóa
    if (hardDelete) {
      await this.roleRepository.hardDelete(roleId);
    } else {
      await this.roleRepository.softDelete(roleId);
    }
  }

  /**
   * Lấy permissions của role
   */
  async getRolePermissions(roleId: string): Promise<string[]> {
    const role = await this.getRoleById(roleId);
    return role.getAllPermissions();
  }

  /**
   * Thêm permissions vào role
   */
  async addPermissionsToRole(
    roleId: string,
    newPermissions: string[]
  ): Promise<IRole> {
    const role = await this.getRoleById(roleId);

    // Không cho phép sửa system role
    if (role.isSystemRole) {
      throw new AppError('Cannot modify system role permissions', 403);
    }

    // Lấy permissions hiện tại
    const currentPermissions = role.getAllPermissions();
    
    // Merge permissions (loại bỏ duplicate)
    const allPermissions = [...new Set([...currentPermissions, ...newPermissions])];

    // Update role
    return await this.updateRole(roleId, {
      permissions: allPermissions,
    });
  }

  /**
   * Xóa permissions khỏi role
   */
  async removePermissionsFromRole(
    roleId: string,
    permissionsToRemove: string[]
  ): Promise<IRole> {
    const role = await this.getRoleById(roleId);

    // Không cho phép sửa system role
    if (role.isSystemRole) {
      throw new AppError('Cannot modify system role permissions', 403);
    }

    // Lấy permissions hiện tại
    const currentPermissions = role.getAllPermissions();
    
    // Filter out permissions to remove
    const remainingPermissions = currentPermissions.filter(
      (p: string) => !permissionsToRemove.includes(p)
    );

    // Update role
    return await this.updateRole(roleId, {
      permissions: remainingPermissions,
    });
  }

  /**
   * Kiểm tra role có permission không
   */
  async checkRoleHasPermission(
    roleId: string,
    permission: string
  ): Promise<boolean> {
    const role = await this.getRoleById(roleId);
    return role.hasPermission(permission);
  }

  /**
   * Lấy số lượng users theo role
   */
  async getRoleUserCount(roleId: string): Promise<number> {
    if (!Types.ObjectId.isValid(roleId)) {
      throw new AppError('Invalid role ID', 400);
    }

    return await this.roleRepository.getUserCountByRole(roleId);
  }

  /**
   * Lấy system roles
   */
  async getSystemRoles(): Promise<IRole[]> {
    return await this.roleRepository.getSystemRoles();
  }

  /**
   * Lấy custom roles
   */
  async getCustomRoles(): Promise<IRole[]> {
    return await this.roleRepository.getCustomRoles();
  }
}
