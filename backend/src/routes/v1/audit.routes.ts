import { Router } from 'express';
import * as auditController from '../../controllers/audit.controller.js';
import { protect } from '../../middlewares/auth/protect.middleware.js';
import { checkPermission, checkHierarchy } from '../../middlewares/auth/rbac.middleware.js';
import { PERMISSIONS } from '../../config/permissions.js';
import { auditSwaggerDocs } from '../../docs/audit.docs.js';

const router = Router();

/**
 * 🔐 All routes require authentication
 */
router.use(protect);

/**
 * @route   GET /api/v1/audit-logs
 * @desc    Get audit logs with filtering
 * @access  Admin only
 * #swagger.tags = ['Audit Logs']
 * #swagger.summary = 'Get audit logs'
 * #swagger.description = 'Get audit logs with filtering and pagination (Admin only)'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.get(
    '/',
    checkPermission(PERMISSIONS.AUDIT.READ),
    checkHierarchy(2), // HR Manager trở lên
    auditController.getAuditLogs
);

/**
 * @route   GET /api/v1/audit-logs/statistics
 * @desc    Get audit statistics
 * @access  Admin only
 * #swagger.tags = ['Audit Logs']
 * #swagger.summary = 'Get audit statistics'
 * #swagger.description = 'Get audit log statistics (Admin only)'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.get(
    '/statistics',
    checkPermission(PERMISSIONS.AUDIT.READ_ALL),
    checkHierarchy(1), // Chỉ Admin
    auditController.getAuditStatistics
);

/**
 * @route   GET /api/v1/audit-logs/suspicious
 * @desc    Get suspicious activities
 * @access  Admin only
 * #swagger.tags = ['Audit Logs']
 * #swagger.summary = 'Get suspicious activities'
 * #swagger.description = 'Get potentially suspicious activities (Admin only)'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.get(
    '/suspicious',
    checkPermission(PERMISSIONS.AUDIT.READ_ALL),
    checkHierarchy(1), // Chỉ Admin
    auditController.getSuspiciousActivities
);

/**
 * @route   GET /api/v1/audit-logs/user/:userId
 * @desc    Get audit logs for specific user
 * @access  Admin or own user
 * #swagger.tags = ['Audit Logs']
 * #swagger.summary = 'Get user audit logs'
 * #swagger.description = 'Get audit logs for a specific user'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.get(
    '/user/:userId',
    auditController.getUserAuditLogs
);

export default router;
