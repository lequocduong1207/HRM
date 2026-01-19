import { Role, IRole } from '../models/role.model.js';
import { Types } from 'mongoose';

export class RoleRepository {
  /**
   * Tạo role mới
   */
  async create(roleData: Partial<IRole>): Promise<IRole> {
    const role = new Role(roleData);
    return await role.save();
  }

  /**
   * Tìm role theo ID
   */
  async findById(roleId: string | Types.ObjectId): Promise<IRole | null> {
    return await Role.findById(roleId);
  }

  /**
   * Tìm role theo tên
   */
  async findByName(name: string): Promise<IRole | null> {
    return await Role.findByName(name);
  }

  /**
   * Lấy tất cả roles
   */
  async findAll(options?: {
    includeInactive?: boolean;
    sortBy?: 'name' | 'hierarchy' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }): Promise<IRole[]> {
    const {
      includeInactive = false,
      sortBy = 'hierarchy',
      sortOrder = 'asc',
    } = options || {};

    const query: any = {};
    if (!includeInactive) {
      query.isActive = true;
    }

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    return await Role.find(query).sort(sortOptions);
  }

  /**
   * Lấy roles theo hierarchy range
   */
  async findByHierarchyRange(
    minLevel: number,
    maxLevel: number
  ): Promise<IRole[]> {
    return await Role.findByHierarchy(minLevel, maxLevel);
  }

  /**
   * Cập nhật role
   */
  async update(
    roleId: string | Types.ObjectId,
    updateData: Partial<IRole>
  ): Promise<IRole | null> {
    return await Role.findByIdAndUpdate(
      roleId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  /**
   * Xóa role (soft delete bằng cách set isActive = false)
   */
  async softDelete(roleId: string | Types.ObjectId): Promise<IRole | null> {
    return await Role.findByIdAndUpdate(
      roleId,
      { $set: { isActive: false } },
      { new: true }
    );
  }

  /**
   * Xóa role hoàn toàn (chỉ non-system roles)
   */
  async hardDelete(roleId: string | Types.ObjectId): Promise<boolean> {
    const role = await Role.findById(roleId);
    
    if (!role) {
      return false;
    }

    if (role.isSystemRole) {
      throw new Error('Cannot delete system role');
    }

    await Role.findByIdAndDelete(roleId);
    return true;
  }

  /**
   * Kiểm tra tên role đã tồn tại
   */
  async nameExists(name: string, excludeId?: string): Promise<boolean> {
    return await Role.nameExists(name, excludeId);
  }

  /**
   * Đếm số lượng roles
   */
  async count(filter?: any): Promise<number> {
    return await Role.countDocuments(filter || {});
  }

  /**
   * Lấy system roles
   */
  async getSystemRoles(): Promise<IRole[]> {
    return await Role.find({ isSystemRole: true, isActive: true })
      .sort({ hierarchy: 1 });
  }

  /**
   * Lấy custom roles (non-system)
   */
  async getCustomRoles(): Promise<IRole[]> {
    return await Role.find({ isSystemRole: false, isActive: true })
      .sort({ name: 1 });
  }

  /**
   * Bulk create roles
   */
  async bulkCreate(rolesData: Partial<IRole>[]): Promise<any[]> {
    return await Role.insertMany(rolesData);
  }

  /**
   * Kiểm tra role có đang được sử dụng không
   */
  async isRoleInUse(roleId: string | Types.ObjectId): Promise<boolean> {
    const { User } = await import('../models/user.model.js');
    const count = await User.countDocuments({ roleId });
    return count > 0;
  }

  /**
   * Lấy số lượng users theo role
   */
  async getUserCountByRole(roleId: string | Types.ObjectId): Promise<number> {
    const { User } = await import('../models/user.model.js');
    return await User.countDocuments({ roleId });
  }
}
