import mongoSanitize from 'express-mongo-sanitize';
import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

/**
 * 🛡️ INPUT SANITIZATION
 * 
 * Sanitization là quá trình làm sạch input data để ngăn chặn:
 * - NoSQL Injection attacks
 * - XSS (Cross-Site Scripting) attacks
 * - SQL Injection (nếu dùng SQL)
 * - Command Injection
 */

/**
 * 🔒 MONGO SANITIZE MIDDLEWARE
 * 
 * Bảo vệ khỏi NoSQL Injection attacks bằng cách:
 * 1. Remove keys starting with '$' (MongoDB operators)
 * 2. Remove keys containing '.' (dot notation)
 * 
 * ⚠️ VÍ DỤ TAN CÔNG NoSQL Injection:
 * 
 * Normal login:
 * ```json
 * {
 *   "email": "admin@example.com",
 *   "password": "password123"
 * }
 * ```
 * 
 * Malicious login (trying to bypass authentication):
 * ```json
 * {
 *   "email": {"$gt": ""},
 *   "password": {"$gt": ""}
 * }
 * ```
 * 
 * MongoDB query sẽ thành:
 * ```javascript
 * User.findOne({ email: {$gt: ""}, password: {$gt: ""} })
 * // Trả về user đầu tiên → bypass authentication!
 * ```
 * 
 * ✅ SAU KHI SANITIZE:
 * ```json
 * {
 *   "email": "",
 *   "password": ""
 * }
 * ```
 * MongoDB operators đã bị remove → attack fail!
 */
export const mongoSanitizeMiddleware = mongoSanitize({
    // Replace prohibited characters with '_'
    replaceWith: '_',
    // Remove data that contains prohibited characters
    onSanitize: ({ req, key }) => {
        console.warn(`⚠️ Sanitized request from ${req.ip}: Removed key '${key}'`);
    }
});

/**
 * 🧹 XSS SANITIZATION MIDDLEWARE
 * 
 * Sanitize string inputs để ngăn XSS attacks
 * 
 * ⚠️ VÍ DỤ TAN CÔNG XSS:
 * 
 * Attacker tạo department với tên:
 * ```
 * <script>alert('XSS')</script>
 * <img src=x onerror=alert('XSS')>
 * ```
 * 
 * Khi hiển thị trên UI → script được execute!
 * 
 * ✅ SAU KHI SANITIZE:
 * - Escape HTML entities
 * - Remove script tags
 * - Whitelist allowed HTML (nếu cần)
 */
export const sanitizeStrings = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Sanitize body
        if (req.body) {
            req.body = sanitizeObject(req.body);
        }

        // Sanitize query params
        if (req.query) {
            req.query = sanitizeObject(req.query);
        }

        // Sanitize URL params
        if (req.params) {
            req.params = sanitizeObject(req.params);
        }

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Recursively sanitize object properties
 */
function sanitizeObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
        return sanitizeValue(obj);
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
        // Sanitize key name (prevent prototype pollution)
        const sanitizedKey = sanitizeKey(key);
        sanitized[sanitizedKey] = sanitizeObject(value);
    }

    return sanitized;
}

/**
 * Sanitize individual value
 */
function sanitizeValue(value: any): any {
    if (typeof value !== 'string') {
        return value;
    }

    // Escape HTML to prevent XSS
    let sanitized = validator.escape(value);
    
    // Trim whitespace
    sanitized = sanitized.trim();
    
    return sanitized;
}

/**
 * Sanitize object keys to prevent prototype pollution
 * 
 * ⚠️ PROTOTYPE POLLUTION ATTACK:
 * ```json
 * {
 *   "__proto__": {"isAdmin": true}
 * }
 * ```
 * 
 * ✅ BLOCKED: Remove __proto__, constructor, prototype
 */
function sanitizeKey(key: string): string {
    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
    if (dangerousKeys.includes(key.toLowerCase())) {
        return '_blocked_key_';
    }
    return key;
}

/**
 * 🎯 EMAIL SANITIZATION
 * 
 * Normalize và validate email addresses
 */
export const sanitizeEmail = (email: string): string => {
    if (!email || typeof email !== 'string') {
        return '';
    }

    // Normalize email (lowercase, trim)
    let sanitized = validator.normalizeEmail(email, {
        all_lowercase: true,
        gmail_remove_dots: false, // Keep dots in Gmail
        gmail_remove_subaddress: false // Keep + addresses
    }) || email.toLowerCase().trim();

    // Remove any non-email characters
    sanitized = sanitized.replace(/[^\w\s@._-]/gi, '');

    return sanitized;
};

/**
 * 🔢 SANITIZE NUMERIC INPUT
 * 
 * Ensure numeric values are actual numbers
 */
export const sanitizeNumber = (value: any): number | null => {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const num = Number(value);
    if (isNaN(num)) {
        return null;
    }

    return num;
};

/**
 * 📅 SANITIZE DATE INPUT
 * 
 * Validate and sanitize date strings
 */
export const sanitizeDate = (dateString: any): Date | null => {
    if (!dateString) {
        return null;
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return null;
    }

    return date;
};

/**
 * 🆔 SANITIZE MONGODB OBJECTID
 * 
 * Validate ObjectId format
 */
export const sanitizeObjectId = (id: any): string | null => {
    if (!id || typeof id !== 'string') {
        return null;
    }

    // MongoDB ObjectId is 24 hex characters
    const objectIdPattern = /^[a-f\d]{24}$/i;
    if (!objectIdPattern.test(id)) {
        return null;
    }

    return id;
};

/**
 * 📝 CUSTOM SANITIZATION FOR SPECIFIC FIELDS
 * 
 * Example: Sanitize username, phone number, etc.
 */
export const customSanitizers = {
    username: (username: string): string => {
        if (!username || typeof username !== 'string') {
            return '';
        }
        // Allow only alphanumeric, underscore, hyphen
        return username.replace(/[^\w-]/gi, '').substring(0, 50);
    },

    phoneNumber: (phone: string): string => {
        if (!phone || typeof phone !== 'string') {
            return '';
        }
        // Remove all non-numeric characters
        return phone.replace(/\D/g, '').substring(0, 15);
    },

    url: (url: string): string => {
        if (!url || typeof url !== 'string') {
            return '';
        }
        // Validate and sanitize URL
        if (validator.isURL(url, { protocols: ['http', 'https'], require_protocol: true })) {
            return url;
        }
        return '';
    }
};

/**
 * 📊 SANITIZATION SUMMARY:
 * 
 * 1. mongoSanitizeMiddleware:
 *    - Apply globally in app.ts
 *    - Removes MongoDB operators ($, .)
 * 
 * 2. sanitizeStrings:
 *    - Apply globally or per-route
 *    - Escapes HTML entities
 *    - Prevents XSS
 * 
 * 3. Specific sanitizers:
 *    - Use in validators or services
 *    - sanitizeEmail, sanitizeNumber, etc.
 * 
 * 4. Custom sanitizers:
 *    - Use for specific business logic
 *    - Username, phone, URL, etc.
 */

/**
 * 🎯 USAGE EXAMPLES:
 * 
 * 1. In app.ts (Global):
 * ```typescript
 * app.use(mongoSanitizeMiddleware);
 * app.use(sanitizeStrings);
 * ```
 * 
 * 2. In specific route:
 * ```typescript
 * router.post('/login', 
 *   sanitizeStrings,
 *   authLimiter,
 *   validate(loginSchema),
 *   authController.login
 * );
 * ```
 * 
 * 3. In service/validator:
 * ```typescript
 * const email = sanitizeEmail(req.body.email);
 * const phone = customSanitizers.phoneNumber(req.body.phone);
 * ```
 */
