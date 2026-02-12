/**
 * Role Types
 */

export interface IRole {
  _id: string;
  name: string;
  displayName: string;
  description?: string;
  permissions: string[];
  isSystemRole: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  name: string;
  displayName: string;
  description?: string;
  permissions: string[];
}

export interface UpdateRoleRequest extends Partial<CreateRoleRequest> {
  isActive?: boolean;
}
