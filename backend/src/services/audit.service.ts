import { Request } from 'express';
import { AuditLog, AuditAction, AuditSeverity } from '../models/audit-log.model.js';

/**
 * 📝 AUDIT SERVICE
 * 
 * Centralized service for logging all audit events
 * 
 * Usage:
 * ```typescript
 * await AuditService.log({
 *   action: 'LOGIN_SUCCESS',
 *   userId: user._id,
 *   userEmail: user.email,
 *   ipAddress: req.ip,
 *   description: 'User logged in successfully'
 * });
 * ```
 */

interface AuditLogData {
  // Required
  action: AuditAction;
  ipAddress: string;
  description: string;
  
  // User context (optional but recommended)
  userId?: string;
  userEmail?: string;
  userRole?: string;
  
  // Optional
  severity?: AuditSeverity;
  resource?: string;
  resourceId?: string;
  changes?: any;
  metadata?: any;
  userAgent?: string;
  success?: boolean;
  errorMessage?: string;
}

class AuditServiceClass {
  /**
   * 📝 Log an audit event
   */
  async log(data: AuditLogData): Promise<void> {
    try {
      await AuditLog.create({
        userId: data.userId,
        userEmail: data.userEmail,
        userRole: data.userRole,
        action: data.action,
        severity: data.severity || this.inferSeverity(data.action),
        description: data.description,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        resource: data.resource,
        resourceId: data.resourceId,
        changes: data.changes,
        metadata: data.metadata,
        success: data.success !== undefined ? data.success : true,
        errorMessage: data.errorMessage,
        timestamp: new Date()
      });
    } catch (error) {
      // Don't let audit logging failure break the application
      console.error('❌ Failed to create audit log:', error);
    }
  }

  /**
   * 🔐 Log authentication events
   */
  async logAuth(
    action: Extract<AuditAction, 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'PASSWORD_CHANGED' | 'PASSWORD_RESET_REQUESTED' | 'PASSWORD_RESET_COMPLETED' | 'ACCOUNT_LOCKED' | 'ACCOUNT_UNLOCKED'>,
    req: Request,
    userId?: string,
    userEmail?: string,
    success: boolean = true,
    errorMessage?: string
  ): Promise<void> {
    await this.log({
      action,
      userId,
      userEmail,
      ipAddress: this.getClientIp(req),
      userAgent: req.headers['user-agent'],
      description: this.getActionDescription(action, userEmail),
      success,
      errorMessage,
      severity: success ? 'INFO' : 'WARNING'
    });
  }

  /**
   * 👤 Log user management events
   */
  async logUserManagement(
    action: Extract<AuditAction, 'USER_CREATED' | 'USER_UPDATED' | 'USER_DELETED' | 'USER_ROLE_CHANGED' | 'USER_ACTIVATED' | 'USER_DEACTIVATED'>,
    req: Request,
    targetUserId: string,
    targetUserEmail?: string,
    changes?: any
  ): Promise<void> {
    const user = (req as any).user;
    
    await this.log({
      action,
      userId: user?.userId,
      userEmail: user?.email,
      userRole: user?.role,
      ipAddress: this.getClientIp(req),
      userAgent: req.headers['user-agent'],
      description: this.getActionDescription(action, targetUserEmail),
      resource: 'User',
      resourceId: targetUserId,
      changes
    });
  }

  /**
   * 🏢 Log resource events (CRUD)
   */
  async logResourceAction(
    action: AuditAction,
    req: Request,
    resource: string,
    resourceId?: string,
    changes?: any,
    metadata?: any
  ): Promise<void> {
    const user = (req as any).user;
    
    await this.log({
      action,
      userId: user?.userId,
      userEmail: user?.email,
      userRole: user?.role,
      ipAddress: this.getClientIp(req),
      userAgent: req.headers['user-agent'],
      description: `${action} on ${resource}${resourceId ? ` (ID: ${resourceId})` : ''}`,
      resource,
      resourceId,
      changes,
      metadata
    });
  }

  /**
   * 🚨 Log security events
   */
  async logSecurityEvent(
    action: Extract<AuditAction, 'PERMISSION_DENIED' | 'SUSPICIOUS_ACTIVITY' | 'IP_BLOCKED' | 'RATE_LIMIT_EXCEEDED' | 'INVALID_TOKEN'>,
    req: Request,
    description: string,
    metadata?: any
  ): Promise<void> {
    const user = (req as any).user;
    
    await this.log({
      action,
      userId: user?.userId,
      userEmail: user?.email,
      ipAddress: this.getClientIp(req),
      userAgent: req.headers['user-agent'],
      description,
      severity: 'WARNING',
      success: false,
      metadata
    });
  }

  /**
   * 📊 Query audit logs
   */
  async getLogs(filters: {
    userId?: string;
    action?: AuditAction;
    severity?: AuditSeverity;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    success?: boolean;
    limit?: number;
    page?: number;
  }) {
    const query: any = {};
    
    if (filters.userId) query.userId = filters.userId;
    if (filters.action) query.action = filters.action;
    if (filters.severity) query.severity = filters.severity;
    if (filters.resource) query.resource = filters.resource;
    if (filters.success !== undefined) query.success = filters.success;
    
    if (filters.startDate || filters.endDate) {
      query.timestamp = {};
      if (filters.startDate) query.timestamp.$gte = filters.startDate;
      if (filters.endDate) query.timestamp.$lte = filters.endDate;
    }
    
    const limit = filters.limit || 50;
    const page = filters.page || 1;
    const skip = (page - 1) * limit;
    
    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate('userId', 'fullName email')
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip(skip)
        .lean(),
      AuditLog.countDocuments(query)
    ]);
    
    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * 📈 Get audit statistics
   */
  async getStatistics(startDate?: Date, endDate?: Date) {
    const match: any = {};
    if (startDate || endDate) {
      match.timestamp = {};
      if (startDate) match.timestamp.$gte = startDate;
      if (endDate) match.timestamp.$lte = endDate;
    }
    
    const [
      totalLogs,
      failedActions,
      actionCounts,
      severityCounts,
      topUsers
    ] = await Promise.all([
      AuditLog.countDocuments(match),
      AuditLog.countDocuments({ ...match, success: false }),
      AuditLog.aggregate([
        { $match: match },
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      AuditLog.aggregate([
        { $match: match },
        { $group: { _id: '$severity', count: { $sum: 1 } } }
      ]),
      AuditLog.aggregate([
        { $match: { ...match, userId: { $exists: true } } },
        { $group: { _id: { userId: '$userId', userEmail: '$userEmail' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);
    
    return {
      totalLogs,
      failedActions,
      successRate: totalLogs > 0 ? ((totalLogs - failedActions) / totalLogs * 100).toFixed(2) + '%' : 'N/A',
      actionCounts,
      severityCounts,
      topUsers
    };
  }

  /**
   * 🔍 Search suspicious activities
   */
  async getSuspiciousActivities(hours: number = 24) {
    const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const [
      failedLogins,
      blockedIPs,
      rateLimitExceeded,
      permissionDenied
    ] = await Promise.all([
      AuditLog.aggregate([
        {
          $match: {
            action: 'LOGIN_FAILED',
            timestamp: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: { ipAddress: '$ipAddress', userEmail: '$userEmail' },
            count: { $sum: 1 },
            lastAttempt: { $max: '$timestamp' }
          }
        },
        { $match: { count: { $gte: 3 } } },
        { $sort: { count: -1 } }
      ]),
      AuditLog.find({
        action: 'IP_BLOCKED',
        timestamp: { $gte: startDate }
      }).sort({ timestamp: -1 }).limit(20),
      AuditLog.find({
        action: 'RATE_LIMIT_EXCEEDED',
        timestamp: { $gte: startDate }
      }).sort({ timestamp: -1 }).limit(20),
      AuditLog.find({
        action: 'PERMISSION_DENIED',
        timestamp: { $gte: startDate }
      }).sort({ timestamp: -1 }).limit(20)
    ]);
    
    return {
      failedLogins,
      blockedIPs,
      rateLimitExceeded,
      permissionDenied
    };
  }

  // Helper methods
  private getClientIp(req: Request): string {
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
      return (forwardedFor as string).split(',')[0].trim();
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
  }

  private inferSeverity(action: AuditAction): AuditSeverity {
    if (action.includes('FAILED') || action.includes('DENIED') || action.includes('BLOCKED') || action.includes('EXCEEDED')) {
      return 'WARNING';
    }
    if (action.includes('DELETED') || action.includes('LOCKED')) {
      return 'WARNING';
    }
    if (action.includes('SUSPICIOUS') || action === 'ACCOUNT_LOCKED') {
      return 'ERROR';
    }
    return 'INFO';
  }

  private getActionDescription(action: AuditAction, target?: string): string {
    const descriptions: Record<AuditAction, string> = {
      LOGIN_SUCCESS: `User ${target || 'unknown'} logged in successfully`,
      LOGIN_FAILED: `Failed login attempt for ${target || 'unknown'}`,
      LOGOUT: `User ${target || 'unknown'} logged out`,
      PASSWORD_CHANGED: `Password changed for ${target || 'unknown'}`,
      PASSWORD_RESET_REQUESTED: `Password reset requested for ${target || 'unknown'}`,
      PASSWORD_RESET_COMPLETED: `Password reset completed for ${target || 'unknown'}`,
      ACCOUNT_LOCKED: `Account locked for ${target || 'unknown'}`,
      ACCOUNT_UNLOCKED: `Account unlocked for ${target || 'unknown'}`,
      USER_CREATED: `User ${target || 'unknown'} created`,
      USER_UPDATED: `User ${target || 'unknown'} updated`,
      USER_DELETED: `User ${target || 'unknown'} deleted`,
      USER_ROLE_CHANGED: `Role changed for user ${target || 'unknown'}`,
      USER_ACTIVATED: `User ${target || 'unknown'} activated`,
      USER_DEACTIVATED: `User ${target || 'unknown'} deactivated`,
      EMPLOYEE_CREATED: 'Employee created',
      EMPLOYEE_UPDATED: 'Employee updated',
      EMPLOYEE_DELETED: 'Employee deleted',
      DEPARTMENT_CREATED: 'Department created',
      DEPARTMENT_UPDATED: 'Department updated',
      DEPARTMENT_DELETED: 'Department deleted',
      DEPARTMENT_RESTORED: 'Department restored',
      ATTENDANCE_CHECKED_IN: 'Attendance checked in',
      ATTENDANCE_CHECKED_OUT: 'Attendance checked out',
      ATTENDANCE_UPDATED: 'Attendance updated',
      ATTENDANCE_DELETED: 'Attendance deleted',
      PERMISSION_DENIED: 'Permission denied',
      SUSPICIOUS_ACTIVITY: 'Suspicious activity detected',
      IP_BLOCKED: 'IP address blocked',
      RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
      INVALID_TOKEN: 'Invalid token detected',
      DATA_EXPORTED: 'Data exported',
      DATA_IMPORTED: 'Data imported',
      BULK_UPDATE: 'Bulk update performed',
      BULK_DELETE: 'Bulk delete performed'
    };
    
    return descriptions[action] || `Action: ${action}`;
  }
}

export const AuditService = new AuditServiceClass();
