import { Request, Response, NextFunction } from 'express';
import { AppError } from '../error/error-handler.middleware.js';

const WHITELIST_IPS: string[] = [
    // Localhost
    '127.0.0.1',
    '::1',
    '::ffff:127.0.0.1',
];

const BLACKLIST_IPS: string[] = [
    // Example malicious IPs
];

// Helper to get client IP considering proxies

function getClientIp(req: Request): string {
    // Check X-Forwarded-For header (set by proxies)
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
        const ips = (forwardedFor as string).split(',');
        return ips[0].trim();
    }
    
    // Check X-Real-IP header (set by nginx)
    const realIp = req.headers['x-real-ip'];
    if (realIp) {
        return realIp as string;
    }
    
    // Use direct connection IP
    return req.ip || req.socket.remoteAddress || 'unknown';
}

// Simple IP matching (exact or CIDR)

function ipMatches(clientIp: string, pattern: string): boolean {
    // Exact match
    if (clientIp === pattern) {
        return true;
    }
    
    // CIDR notation check (simplified - for production use ip-range-check library)
    if (pattern.includes('/')) {
        // For now, just check if IP starts with network portion
        const [network] = pattern.split('/');
        return clientIp.startsWith(network.split('.').slice(0, 3).join('.'));
    }
    
    return false;
}

// Middleware implementations
export const ipWhitelist = (req: Request, res: Response, next: NextFunction) => {
    const clientIp = getClientIp(req);
    
    // Check if IP is in whitelist
    const isWhitelisted = WHITELIST_IPS.some(pattern => 
        ipMatches(clientIp, pattern)
    );
    
    if (!isWhitelisted) {
        console.warn(`⚠️ Blocked request from non-whitelisted IP: ${clientIp} to ${req.originalUrl}`);
        throw new AppError(
            'Access denied. Your IP address is not authorized to access this resource.', 
            403
        );
    }
    
    next();
};

// Blacklist middleware

export const ipBlacklist = (req: Request, res: Response, next: NextFunction) => {
    const clientIp = getClientIp(req);
    
    // Check if IP is in blacklist
    const isBlacklisted = BLACKLIST_IPS.some(pattern => 
        ipMatches(clientIp, pattern)
    );
    
    if (isBlacklisted) {
        console.warn(`🚫 Blocked request from blacklisted IP: ${clientIp} to ${req.originalUrl}`);
        throw new AppError('Access denied.', 403);
    }
    
    next();
};

// Example data structure for dynamic IP access control

interface IpAccessControl {
    ip: string;
    type: 'whitelist' | 'blacklist';
    reason?: string;
    expiresAt?: Date;
    createdAt: Date;
}

// Middleware to log all IP accesses

export const logIpAccess = (req: Request, res: Response, next: NextFunction) => {
    const clientIp = getClientIp(req);
    const userAgent = req.headers['user-agent'];
    next();
};

export { getClientIp, ipMatches, IpAccessControl }; 
