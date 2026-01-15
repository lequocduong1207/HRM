import { Request, Response, NextFunction } from 'express';
import { AppError } from '../error/error-handler.middleware.js';

/**
 * 🛡️ REQUEST SIZE VALIDATION
 * 
 * Prevents Denial of Service (DoS) attacks via:
 * - Large JSON payloads
 * - Large URL-encoded payloads
 * - Deeply nested objects
 * - Excessive array lengths
 * - Too many query parameters
 */

/**
 * 🔒 VALIDATE JSON PAYLOAD SIZE
 * 
 * Prevents attacks using extremely large JSON payloads that can:
 * - Consume excessive memory
 * - Cause CPU exhaustion during parsing
 * - Fill up disk space (if logged)
 * - Crash the application
 * 
 * Example attack:
 * ```json
 * {
 *   "data": "A".repeat(100000000) // 100MB string
 * }
 * ```
 */
export const validateJsonSize = (req: Request, res: Response, next: NextFunction) => {
    // Already handled by express.json({ limit: '10mb' })
    // This is an additional check
    
    const contentLength = req.headers['content-length'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (contentLength && parseInt(contentLength) > maxSize) {
        throw new AppError('Request payload too large. Maximum size is 10MB.', 413);
    }
    
    next();
};

/**
 * 🔒 VALIDATE OBJECT DEPTH
 * 
 * Prevents attacks using deeply nested objects that can:
 * - Cause stack overflow
 * - Exhaust memory during recursive operations
 * - Slow down validation/sanitization
 * 
 * Example attack:
 * ```json
 * {
 *   "a": {
 *     "b": {
 *       "c": {
 *         // ... 1000 levels deep
 *       }
 *     }
 *   }
 * }
 * ```
 */
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

/**
 * Helper: Calculate object nesting depth
 */
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

/**
 * 🔒 VALIDATE ARRAY LENGTH
 * 
 * Prevents attacks using extremely long arrays that can:
 * - Consume excessive memory
 * - Cause timeout during iteration
 * - Overwhelm database with bulk operations
 * 
 * Example attack:
 * ```json
 * {
 *   "items": [1, 2, 3, ..., 1000000] // 1 million items
 * }
 * ```
 */
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

/**
 * Helper: Check all arrays in object
 */
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

/**
 * 🔒 VALIDATE QUERY PARAMETERS
 * 
 * Prevents attacks using excessive query parameters:
 * - Too many parameters
 * - Extremely long parameter values
 * - Duplicate parameters
 * 
 * Example attack:
 * ```
 * GET /api/users?param1=value1&param2=value2&...&param1000=value1000
 * ```
 */
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

/**
 * 🔒 VALIDATE STRING LENGTHS
 * 
 * Prevents attacks using extremely long strings:
 * - Long names, descriptions, etc.
 * - Buffer overflow attempts
 * - Memory exhaustion
 */
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

/**
 * Helper: Check all strings in object
 */
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

/**
 * 🎯 COMBINED REQUEST VALIDATION MIDDLEWARE
 * 
 * Combines all validation checks into one middleware
 * Use this for convenience instead of applying each individually
 */
export const validateRequest = [
    validateJsonSize,
    validateObjectDepth,
    validateArrayLength,
    validateQueryParams,
    validateStringLengths
];

/**
 * 📊 VALIDATION SUMMARY:
 * 
 * Limits enforced:
 * - JSON payload: 10MB maximum
 * - Object depth: 10 levels maximum
 * - Array length: 1,000 items maximum
 * - Query params: 50 parameters maximum
 * - String length: 10,000 characters maximum
 * 
 * These limits prevent:
 * - Memory exhaustion
 * - CPU exhaustion
 * - Stack overflow
 * - Disk space exhaustion
 * - Application crashes
 */

/**
 * 🎯 USAGE EXAMPLES:
 * 
 * 1. Apply to all routes (in app.ts):
 * ```typescript
 * app.use('/api', validateRequest);
 * ```
 * 
 * 2. Apply to specific routes:
 * ```typescript
 * router.post('/departments', 
 *   validateObjectDepth,
 *   validateArrayLength,
 *   departmentController.create
 * );
 * ```
 * 
 * 3. Apply individual validations:
 * ```typescript
 * router.get('/search', 
 *   validateQueryParams,
 *   searchController.search
 * );
 * ```
 */

/**
 * 🚨 ATTACK SCENARIOS PREVENTED:
 * 
 * 1. JSON Bomb:
 *    POST with 100MB JSON → Rejected (validateJsonSize)
 * 
 * 2. Billion Laughs:
 *    Deeply nested objects → Rejected (validateObjectDepth)
 * 
 * 3. Array Flood:
 *    Array with 1 million items → Rejected (validateArrayLength)
 * 
 * 4. Query Spam:
 *    100 query parameters → Rejected (validateQueryParams)
 * 
 * 5. String Bomb:
 *    String with 1 million characters → Rejected (validateStringLengths)
 */

/**
 * ⚖️ BALANCING SECURITY & USABILITY:
 * 
 * These limits are set conservatively. You may need to adjust based on:
 * - Your application requirements
 * - Server resources
 * - Expected use cases
 * 
 * For example:
 * - File upload API: Increase maxSize
 * - Bulk operations: Increase maxArrayLength
 * - Search API: Increase maxParams
 * 
 * Always monitor and adjust based on real usage patterns!
 */
