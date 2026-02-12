import mongoSanitize from 'express-mongo-sanitize';
import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

// mongoSanitize middleware to prevent NoSQL injection
// Removes any keys containing prohibited characters ($, .)
export const mongoSanitizeMiddleware = mongoSanitize({
    // Replace prohibited characters with '_'
    replaceWith: '_',
    // Remove data that contains prohibited characters
    onSanitize: ({ req, key }) => {
        console.warn(`⚠️ Sanitized request from ${req.ip}: Removed key '${key}'`);
    }
});

// Middleware to sanitize all string inputs in req.body, req.query, req.params
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

// Recursive function to sanitize an object
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

// Sanitize individual value
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

// Sanitize object keys to prevent prototype pollution
function sanitizeKey(key: string): string {
    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
    if (dangerousKeys.includes(key.toLowerCase())) {
        return '_blocked_key_';
    }
    return key;
}

// sanitize email input
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

// sanitize number input
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

// sanitize date input
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

// sanitize MongoDB ObjectId
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

// Custom sanitizers for specific business logic
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