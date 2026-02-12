import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../../services/audit.service.js';
import { AuditAction } from '../../models/audit-log.model.js';

const SENSITIVE_FIELDS = [
  'password',
  'confirmPassword',
  'oldPassword',
  'newPassword',
  'token',
  'refreshToken',
  'accessToken',
  'authorization',
  'cookie',
  'creditCard',
  'ssn',
  'socialSecurity'
];

// Create an audit middleware for a specific action

export function auditMiddleware(action: AuditAction, resourceName?: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const user = (req as any).user;
    
    const originalSend = res.send;
    const originalJson = res.json;
    
    let responseBody: any;
    let responseLogged = false;
    
    res.send = function (body: any) {
      if (!responseLogged) {
        responseBody = body;
        logAuditEvent();
        responseLogged = true;
      }
      return originalSend.call(this, body);
    };
    
    res.json = function (body: any) {
      if (!responseLogged) {
        responseBody = body;
        logAuditEvent();
        responseLogged = true;
      }
      return originalJson.call(this, body);
    };
    
    async function logAuditEvent() {
      const responseTime = Date.now() - startTime;
      const success = res.statusCode >= 200 && res.statusCode < 400;
      
      const resource = resourceName || extractResourceFromPath(req.path);
      const resourceId = req.params.id || extractResourceId(responseBody);
      
      const cleanedBody = removeSensitiveData(req.body);
      
      const changes = action.includes('UPDATED') ? cleanedBody : undefined;
      
      await AuditService.log({
        action,
        userId: user?.userId,
        userEmail: user?.email,
        userRole: user?.role,
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
        description: `${req.method} ${req.path} - ${res.statusCode}`,
        resource,
        resourceId,
        changes,
        metadata: {
          method: req.method,
          path: req.path,
          query: req.query,
          responseTime: `${responseTime}ms`,
          statusCode: res.statusCode
        },
        success,
        errorMessage: success ? undefined : extractErrorMessage(responseBody)
      });
    }
    
    next();
  };
}

// Audit all API requests

export function auditApiRequests() {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip health checks and static files
    if (req.path === '/health' || req.path === '/favicon.ico' || req.path.startsWith('/public')) {
      return next();
    }
    
    const startTime = Date.now();
    const user = (req as any).user;
    
    // Log when response is finished
    res.on('finish', async () => {
      const responseTime = Date.now() - startTime;
      const success = res.statusCode >= 200 && res.statusCode < 400;
      
      // Infer action from HTTP method and path
      const action = inferActionFromRequest(req);
      
      if (action) {
        await AuditService.log({
          action,
          userId: user?.userId,
          userEmail: user?.email,
          userRole: user?.role,
          ipAddress: getClientIp(req),
          userAgent: req.headers['user-agent'],
          description: `${req.method} ${req.path} - ${res.statusCode}`,
          resource: extractResourceFromPath(req.path),
          resourceId: req.params.id,
          metadata: {
            method: req.method,
            path: req.path,
            query: req.query,
            responseTime: `${responseTime}ms`,
            statusCode: res.statusCode
          },
          success
        });
      }
    });
    
    next();
  };
}

// Helper functions

function getClientIp(req: Request): string {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    return (forwardedFor as string).split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function removeSensitiveData(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const cleaned: any = Array.isArray(obj) ? [] : {};
  
  for (const key in obj) {
    if (SENSITIVE_FIELDS.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
      cleaned[key] = '[REDACTED]';
    } else if (typeof obj[key] === 'object') {
      cleaned[key] = removeSensitiveData(obj[key]);
    } else {
      cleaned[key] = obj[key];
    }
  }
  
  return cleaned;
}

function extractResourceFromPath(path: string): string {
  // Extract resource name from path like /api/v1/employees -> Employee
  const parts = path.split('/').filter(p => p && p !== 'api' && !p.startsWith('v'));
  if (parts.length > 0) {
    const resource = parts[0];
    // Capitalize first letter and remove 's' for singular form
    return resource.charAt(0).toUpperCase() + resource.slice(1, -1);
  }
  return 'Unknown';
}

function extractResourceId(responseBody: any): string | undefined {
  if (!responseBody) return undefined;
  
  // Try to extract ID from response body
  if (typeof responseBody === 'string') {
    try {
      responseBody = JSON.parse(responseBody);
    } catch {
      return undefined;
    }
  }
  
  if (responseBody.data && responseBody.data._id) {
    return responseBody.data._id.toString();
  }
  
  if (responseBody._id) {
    return responseBody._id.toString();
  }
  
  if (responseBody.id) {
    return responseBody.id.toString();
  }
  
  return undefined;
}

function extractErrorMessage(responseBody: any): string | undefined {
  if (!responseBody) return undefined;
  
  if (typeof responseBody === 'string') {
    try {
      responseBody = JSON.parse(responseBody);
    } catch {
      return responseBody;
    }
  }
  
  return responseBody.message || responseBody.error || undefined;
}

function inferActionFromRequest(req: Request): AuditAction | null {
  const method = req.method;
  const path = req.path.toLowerCase();
  
  // Authentication routes
  if (path.includes('/auth/login')) return 'LOGIN_SUCCESS';
  if (path.includes('/auth/logout')) return 'LOGOUT';
  if (path.includes('/auth/register')) return 'USER_CREATED';
  if (path.includes('/auth/change-password')) return 'PASSWORD_CHANGED';
  if (path.includes('/auth/forgot-password')) return 'PASSWORD_RESET_REQUESTED';
  if (path.includes('/auth/reset-password')) return 'PASSWORD_RESET_COMPLETED';
  
  // User routes
  if (path.includes('/users')) {
    if (method === 'POST') return 'USER_CREATED';
    if (method === 'PUT' || method === 'PATCH') return 'USER_UPDATED';
    if (method === 'DELETE') return 'USER_DELETED';
  }
  
  // Employee routes
  if (path.includes('/employees')) {
    if (method === 'POST') return 'EMPLOYEE_CREATED';
    if (method === 'PUT' || method === 'PATCH') return 'EMPLOYEE_UPDATED';
    if (method === 'DELETE') return 'EMPLOYEE_DELETED';
  }
  
  // Department routes
  if (path.includes('/departments')) {
    if (method === 'POST') return 'DEPARTMENT_CREATED';
    if (method === 'PUT' || method === 'PATCH') return 'DEPARTMENT_UPDATED';
    if (method === 'DELETE') return 'DEPARTMENT_DELETED';
  }
  
  // Attendance routes
  if (path.includes('/attendance')) {
    if (path.includes('/check-in')) return 'ATTENDANCE_CHECKED_IN';
    if (path.includes('/check-out')) return 'ATTENDANCE_CHECKED_OUT';
    if (method === 'PUT' || method === 'PATCH') return 'ATTENDANCE_UPDATED';
    if (method === 'DELETE') return 'ATTENDANCE_DELETED';
  }
  
  // Export/Import routes
  if (path.includes('/export')) return 'DATA_EXPORTED';
  if (path.includes('/import')) return 'DATA_IMPORTED';
  
  return null;
}
