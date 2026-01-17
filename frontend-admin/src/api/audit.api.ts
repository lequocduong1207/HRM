import axios from './axios.customize';

export interface IAuditLog {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
  } | string;
  action: string;
  severity?: string;
  description?: string;
  resourceType?: string;
  resource?: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
  changes?: any;
  metadata?: any;
  success?: boolean;
  timestamp: string;
  createdAt?: string;
}

export interface AuditLogResponse {
  success: boolean;
  data: IAuditLog[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

export const auditService = {
  // Get recent audit logs
  getRecentLogs: async (params?: { limit?: number }): Promise<AuditLogResponse> => {
    const response = await axios.get<AuditLogResponse>('/audit-logs', { params });
    return response as any;
  },

  // Get audit logs with filters
  getAuditLogs: async (params?: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    resourceType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<AuditLogResponse> => {
    const response = await axios.get<AuditLogResponse>('/audit-logs', { params });
    return response as any;
  }
};
