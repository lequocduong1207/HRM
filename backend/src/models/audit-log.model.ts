import { Schema, model, Document } from 'mongoose';

/**
 * 📝 AUDIT LOG MODEL
 * 
 * Tracks all important user actions for:
 * - Security monitoring
 * - Compliance (GDPR, SOC2, HIPAA)
 * - Incident investigation
 * - User behavior analysis
 * - Legal requirements
 */

export type AuditAction = 
  // Authentication
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'PASSWORD_CHANGED'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_RESET_COMPLETED'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_UNLOCKED'
  
  // User Management
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'USER_ROLE_CHANGED'
  | 'USER_ACTIVATED'
  | 'USER_DEACTIVATED'
  
  // Employee Management
  | 'EMPLOYEE_CREATED'
  | 'EMPLOYEE_UPDATED'
  | 'EMPLOYEE_DELETED'
  
  // Department Management
  | 'DEPARTMENT_CREATED'
  | 'DEPARTMENT_UPDATED'
  | 'DEPARTMENT_DELETED'
  | 'DEPARTMENT_RESTORED'
  
  // Attendance
  | 'ATTENDANCE_CHECKED_IN'
  | 'ATTENDANCE_CHECKED_OUT'
  | 'ATTENDANCE_UPDATED'
  | 'ATTENDANCE_DELETED'
  
  // Security Events
  | 'PERMISSION_DENIED'
  | 'SUSPICIOUS_ACTIVITY'
  | 'IP_BLOCKED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INVALID_TOKEN'
  
  // Data Access
  | 'DATA_EXPORTED'
  | 'DATA_IMPORTED'
  | 'BULK_UPDATE'
  | 'BULK_DELETE';

export type AuditSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export interface IAuditLog extends Document {
  // Who performed the action
  userId?: Schema.Types.ObjectId | string;
  userEmail?: string;
  userRole?: string;
  
  // What action was performed
  action: AuditAction;
  severity: AuditSeverity;
  description: string;
  
  // Where it happened
  ipAddress: string;
  userAgent?: string;
  
  // When it happened
  timestamp: Date;
  
  // Additional context
  resource?: string;          // e.g., 'User', 'Department', 'Employee'
  resourceId?: string;        // ID of affected resource
  changes?: any;              // Before/after data for updates
  metadata?: any;             // Additional context
  
  // Result
  success: boolean;
  errorMessage?: string;
}

const AuditLogSchema = new Schema<IAuditLog>({
  // User information
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  userEmail: {
    type: String,
    required: false
  },
  userRole: {
    type: String,
    required: false
  },
  
  // Action details
  action: {
    type: String,
    required: true,
    index: true
  },
  severity: {
    type: String,
    enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'],
    default: 'INFO',
    index: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Location
  ipAddress: {
    type: String,
    required: true,
    index: true
  },
  userAgent: {
    type: String
  },
  
  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Resource context
  resource: {
    type: String,
    index: true
  },
  resourceId: {
    type: String,
    index: true
  },
  changes: {
    type: Schema.Types.Mixed
  },
  metadata: {
    type: Schema.Types.Mixed
  },
  
  // Result
  success: {
    type: Boolean,
    default: true,
    index: true
  },
  errorMessage: {
    type: String
  }
}, {
  timestamps: false, // We use custom timestamp field
  collection: 'audit_logs'
});

// Indexes for efficient querying
AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });
AuditLogSchema.index({ severity: 1, timestamp: -1 });
AuditLogSchema.index({ success: 1, timestamp: -1 });
AuditLogSchema.index({ ipAddress: 1, timestamp: -1 });

// TTL index - auto delete logs older than 1 year (optional)
// Uncomment to enable auto-cleanup
// AuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 31536000 });

export const AuditLog = model<IAuditLog>('AuditLog', AuditLogSchema);
