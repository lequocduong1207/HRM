import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// rate-limit authentication endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: {
        success: false,
        error: 'Too many login attempts from this IP, please try again after 15 minutes'
    },
    standardHeaders: true, 
    legacyHeaders: false, 
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    validate: { trustProxy: false }, 
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            error: 'Too many authentication attempts. Please try again after 15 minutes.',
            retryAfter: '15 minutes'
        });
    }
});

// rate-limit sensitive operations like password reset, email verification
export const sensitiveOperationsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10,
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            error: 'Too many requests. Please slow down.',
            retryAfter: '15 minutes'
        });
    }
});

// rate-limit all API endpoints - default limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 300, 
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            error: 'Rate limit exceeded. Please try again later.',
            retryAfter: '15 minutes'
        });
    }
});

// rate-limit read operations
export const readOperationsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 500, 
    message: {
        success: false,
        error: 'Too many read requests from this IP'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
    skip: (req: Request) => {
        return req.method !== 'GET';
    },
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            error: 'Too many read operations. Please slow down.',
            retryAfter: '15 minutes'
        });
    }
});

// rate-limit write operations
export const writeOperationsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 50, 
    message: {
        success: false,
        error: 'Too many write operations from this IP'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
    skip: (req: Request) => {
        return !['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
    },
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            error: 'Too many write operations. Please slow down.',
            retryAfter: '15 minutes'
        });
    }
});

// rate-limit admin operations
export const adminOperationsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, 
    message: {
        success: false,
        error: 'Too many admin operations from this IP'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            error: 'Admin rate limit exceeded. Please contact support if this persists.',
            retryAfter: '15 minutes'
        });
    }
});