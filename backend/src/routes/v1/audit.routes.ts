import { Router } from 'express';
import * as auditController from '../../controllers/audit.controller.js';
import { protect, admin } from '../../middlewares/auth/protect.middleware.js';
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
    admin,
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
    admin,
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
    admin,
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
