import { Request, Response, NextFunction } from 'express';
import { AppError } from '../error/error-handler.middleware.js';

export const validateJsonSize = (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.headers['content-length'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (contentLength && parseInt(contentLength) > maxSize) {
        throw new AppError('Request payload too large. Maximum size is 10MB.', 413);
    }
    
    next();
};

export const validateObjectDepth = (req: Request, res: Response, next: NextFunction) => {
    const maxDepth = 10;
    
    if (req.body && typeof req.body === 'object') {
        const depth = getObjectDepth(req.body);
        
        if (depth > maxDepth) {
            throw new AppError(
                `Request object too deeply nested. Maximum depth is ${maxDepth} levels.`, 
                400
            );
        }
    }
    
    next();
};

// Helper: Calculate object depth
function getObjectDepth(obj: any, currentDepth = 0): number {
    if (obj === null || typeof obj !== 'object') {
        return currentDepth;
    }
    
    if (Array.isArray(obj)) {
        return Math.max(
            currentDepth,
            ...obj.map(item => getObjectDepth(item, currentDepth + 1))
        );
    }
    
    const depths = Object.values(obj).map(value => 
        getObjectDepth(value, currentDepth + 1)
    );
    
    return depths.length > 0 ? Math.max(...depths) : currentDepth;
}

// Validate array lengths in request body
export const validateArrayLength = (req: Request, res: Response, next: NextFunction) => {
    const maxArrayLength = 1000; // Max 1000 items in any array
    
    if (req.body && typeof req.body === 'object') {
        const hasLargeArray = checkArrayLengths(req.body, maxArrayLength);
        
        if (hasLargeArray) {
            throw new AppError(
                `Request contains array with too many items. Maximum is ${maxArrayLength} items.`, 
                400
            );
        }
    }
    
    next();
};

// Helper: Check all arrays in object
function checkArrayLengths(obj: any, maxLength: number): boolean {
    if (obj === null || typeof obj !== 'object') {
        return false;
    }
    
    if (Array.isArray(obj)) {
        if (obj.length > maxLength) {
            return true;
        }
        return obj.some(item => checkArrayLengths(item, maxLength));
    }
    
    return Object.values(obj).some(value => 
        checkArrayLengths(value, maxLength)
    );
}

export const validateQueryParams = (req: Request, res: Response, next: NextFunction) => {
    const maxParams = 50;
    const maxParamLength = 1000; // characters
    
    const paramCount = Object.keys(req.query).length;
    
    if (paramCount > maxParams) {
        throw new AppError(
            `Too many query parameters. Maximum is ${maxParams}.`, 
            400
        );
    }
    
    // Check parameter lengths
    for (const [key, value] of Object.entries(req.query)) {
        const valueStr = String(value);
        
        if (key.length > maxParamLength) {
            throw new AppError(
                `Query parameter name too long. Maximum is ${maxParamLength} characters.`, 
                400
            );
        }
        
        if (valueStr.length > maxParamLength) {
            throw new AppError(
                `Query parameter value too long. Maximum is ${maxParamLength} characters.`, 
                400
            );
        }
    }
    
    next();
};

export const validateStringLengths = (req: Request, res: Response, next: NextFunction) => {
    const maxStringLength = 10000; // 10,000 characters
    
    if (req.body && typeof req.body === 'object') {
        const hasLongString = checkStringLengths(req.body, maxStringLength);
        
        if (hasLongString) {
            throw new AppError(
                `Request contains string that is too long. Maximum is ${maxStringLength} characters.`, 
                400
            );
        }
    }
    
    next();
};

// Helper: Check all strings in object
function checkStringLengths(obj: any, maxLength: number): boolean {
    if (obj === null) {
        return false;
    }
    
    if (typeof obj === 'string') {
        return obj.length > maxLength;
    }
    
    if (typeof obj !== 'object') {
        return false;
    }
    
    if (Array.isArray(obj)) {
        return obj.some(item => checkStringLengths(item, maxLength));
    }
    
    return Object.values(obj).some(value => 
        checkStringLengths(value, maxLength)
    );
}

export const validateRequest = [
    validateJsonSize,
    validateObjectDepth,
    validateArrayLength,
    validateQueryParams,
    validateStringLengths
];
