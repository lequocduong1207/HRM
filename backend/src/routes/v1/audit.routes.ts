import { Router } from 'express';
import * as auditController from '../../controllers/audit.controller.js';
import { protect, admin } from '../../middlewares/auth/protect.middleware.js';

const router = Router();

/**
 * 🔐 All routes require authentication
 */
router.use(protect);

/**
 * @route   GET /api/v1/audit-logs
 * @desc    Get audit logs with filtering
 * @access  Admin only
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
 */
router.get(
    '/user/:userId',
    auditController.getUserAuditLogs
);

export default router;
