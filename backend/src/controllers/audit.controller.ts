import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middlewares/index.js';
import { AuditService } from '../services/audit.service.js';
import { AuditAction, AuditSeverity } from '../models/audit-log.model.js';

/**
 * @route   GET /api/v1/audit-logs
 * @desc    Get audit logs with filtering and pagination
 * @access  Private (Admin only)
 */
export const getAuditLogs = asyncHandler(async (req: Request, res: Response) => {
    const {
        userId,
        action,
        severity,
        resource,
        startDate,
        endDate,
        success,
        page = '1',
        limit = '50'
    } = req.query;

    const filters: any = {
        page: parseInt(page as string),
        limit: parseInt(limit as string)
    };

    if (userId) filters.userId = userId as string;
    if (action) filters.action = action as AuditAction;
    if (severity) filters.severity = severity as AuditSeverity;
    if (resource) filters.resource = resource as string;
    if (success !== undefined) filters.success = success === 'true';
    
    if (startDate) {
        filters.startDate = new Date(startDate as string);
    }
    if (endDate) {
        filters.endDate = new Date(endDate as string);
    }

    const result = await AuditService.getLogs(filters);

    res.status(200).json({
        success: true,
        message: 'Audit logs retrieved successfully',
        data: result.logs,
        pagination: result.pagination
    });
});

/**
 * @route   GET /api/v1/audit-logs/statistics
 * @desc    Get audit log statistics
 * @access  Private (Admin only)
 */
export const getAuditStatistics = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    const filters: any = {};
    
    if (startDate) {
        filters.startDate = new Date(startDate as string);
    }
    if (endDate) {
        filters.endDate = new Date(endDate as string);
    }

    const statistics = await AuditService.getStatistics(filters.startDate, filters.endDate);

    res.status(200).json({
        success: true,
        message: 'Audit statistics retrieved successfully',
        data: statistics
    });
});

/**
 * @route   GET /api/v1/audit-logs/suspicious
 * @desc    Get suspicious activities
 * @access  Private (Admin only)
 */
export const getSuspiciousActivities = asyncHandler(async (req: Request, res: Response) => {
    const { hours = '24' } = req.query;

    const activities = await AuditService.getSuspiciousActivities(parseInt(hours as string));

    res.status(200).json({
        success: true,
        message: 'Suspicious activities retrieved successfully',
        data: activities
    });
});

/**
 * @route   GET /api/v1/audit-logs/user/:userId
 * @desc    Get audit logs for a specific user
 * @access  Private (Admin or own user)
 */
export const getUserAuditLogs = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { page = '1', limit = '50', startDate, endDate } = req.query;
    
    // Check if user can access these logs (admin or own logs)
    const currentUser = req.user!;
    if (currentUser.role !== 'admin' && currentUser.userId !== userId) {
        throw new AppError('You do not have permission to view these audit logs', 403);
    }

    const filters: any = {
        userId,
        page: parseInt(page as string),
        limit: parseInt(limit as string)
    };
    
    if (startDate) {
        filters.startDate = new Date(startDate as string);
    }
    if (endDate) {
        filters.endDate = new Date(endDate as string);
    }

    const result = await AuditService.getLogs(filters);

    res.status(200).json({
        success: true,
        message: 'User audit logs retrieved successfully',
        data: result.logs,
        pagination: result.pagination
    });
});
