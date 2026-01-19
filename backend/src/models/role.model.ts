import { Schema, model, Document, Model } from "mongoose";

/**
 * Permission Interface
 */
export interface IPermission {
  resource: string;      // 'employee', 'attendance', 'leave', etc.
  actions: string[];     // ['create', 'read:all', 'update', 'delete']
}

/**
 * Role Interface
 */
export interface IRole extends Document {
  name: string;              // 'admin', 'hr_manager', 'department_manager', 'employee'
  displayName: string;       // 'Administrator', 'HR Manager', etc.
  description: string;       // Mô tả vai trò
  permissions: IPermission[]; // Danh sách permissions
  isSystemRole: boolean;     // Không cho phép xóa/sửa role hệ thống
  isActive: boolean;         // Trạng thái active
  hierarchy: number;         // Thứ tự phân cấp: admin=1, hr_manager=2, manager=3, employee=4
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  hasPermission(permission: string): boolean;
  hasAnyPermission(permissions: string[]): boolean;
  hasAllPermissions(permissions: string[]): boolean;
  getAllPermissions(): string[];
}

/**
 * Role Model Interface (for static methods)
 */
export interface IRoleModel extends Model<IRole> {
  findByName(name: string): Promise<IRole | null>;
  findByHierarchy(minLevel: number, maxLevel: number): Promise<IRole[]>;
  nameExists(name: string, excludeId?: string): Promise<boolean>;
}

/**
 * Permission Schema
 */
const permissionSchema = new Schema<IPermission>({
  resource: {
    type: String,
    required: true,
    trim: true,
  },
  actions: [{
    type: String,
    required: true,
    trim: true,
  }],
}, { _id: false });

/**
 * Role Schema
 */
const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    permissions: {
      type: [permissionSchema],
      default: [],
      validate: {
        validator: function(v: IPermission[]) {
          // Validate that permissions array is not empty for non-employee roles
          return v.length > 0;
        },
        message: 'Role must have at least one permission'
      }
    },

    isSystemRole: {
      type: Boolean,
      default: false,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },

    hierarchy: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Indexes
 */
roleSchema.index({ name: 1, isActive: 1 });
roleSchema.index({ hierarchy: 1 });

/**
 * Instance Methods
 */

/**
 * Check if role has a specific permission
 */
roleSchema.methods.hasPermission = function(permission: string): boolean {
  const [resource, ...actionParts] = permission.split(':');
  const action = actionParts.join(':');
  
  const resourcePermission = this.permissions.find(
    (p: IPermission) => p.resource === resource
  );
  
  if (!resourcePermission) return false;
  
  return resourcePermission.actions.includes(action);
};

/**
 * Check if role has any of the given permissions
 */
roleSchema.methods.hasAnyPermission = function(permissions: string[]): boolean {
  return permissions.some(permission => this.hasPermission(permission));
};

/**
 * Check if role has all of the given permissions
 */
roleSchema.methods.hasAllPermissions = function(permissions: string[]): boolean {
  return permissions.every(permission => this.hasPermission(permission));
};

/**
 * Get all permissions as flat array
 */
roleSchema.methods.getAllPermissions = function(): string[] {
  const permissions: string[] = [];
  
  this.permissions.forEach((p: IPermission) => {
    p.actions.forEach(action => {
      permissions.push(`${p.resource}:${action}`);
    });
  });
  
  return permissions;
};

/**
 * Static Methods
 */

/**
 * Find role by name
 */
roleSchema.statics.findByName = function(name: string) {
  return this.findOne({ name: name.toLowerCase(), isActive: true });
};

/**
 * Find roles by hierarchy level
 */
roleSchema.statics.findByHierarchy = function(
  minLevel: number,
  maxLevel: number
) {
  return this.find({
    hierarchy: { $gte: minLevel, $lte: maxLevel },
    isActive: true,
  }).sort({ hierarchy: 1 });
};

/**
 * Check if role name exists
 */
roleSchema.statics.nameExists = async function(
  name: string,
  excludeId?: string
): Promise<boolean> {
  const query: any = { name: name.toLowerCase() };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  const count = await this.countDocuments(query);
  return count > 0;
};

/**
 * Export model
 */
export const Role = model<IRole, IRoleModel>("Role", roleSchema);
