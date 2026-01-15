import { Request, Response, NextFunction } from 'express';
import { AppError } from '../error/error-handler.middleware.js';

/**
 * 🛡️ IP ACCESS CONTROL
 * 
 * Controls which IP addresses can access your API:
 * - Whitelist: Only allow specific IPs (for admin endpoints)
 * - Blacklist: Block specific IPs (for malicious actors)
 * 
 * Use cases:
 * - Restrict admin panel to office IPs
 * - Block known attackers
 * - Allow only internal services
 * - Regional access control
 */

/**
 * 🎯 IP WHITELIST CONFIGURATION
 * 
 * Add IPs that should be allowed access
 * Supports:
 * - Single IPs: '192.168.1.1'
 * - CIDR notation: '192.168.1.0/24'
 * - IPv6: '::1'
 */
const WHITELIST_IPS: string[] = [
    // Localhost
    '127.0.0.1',
    '::1',
    '::ffff:127.0.0.1',
    
    // Office/VPN IPs (example - replace with your actual IPs)
    // '203.0.113.0/24',  // Office network
    // '198.51.100.42',   // VPN gateway
    
    // Add your trusted IPs here
];

/**
 * 🚫 IP BLACKLIST CONFIGURATION
 * 
 * Add IPs that should be blocked
 * These IPs will be rejected immediately
 */
const BLACKLIST_IPS: string[] = [
    // Add malicious IPs here
    // Example: IPs from failed login attempts, scrapers, etc.
    // '203.0.113.1',
    // '198.51.100.1',
];

/**
 * Get real client IP address
 * Handles cases where app is behind proxy/load balancer
 */
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

/**
 * Check if IP matches pattern (supports CIDR)
 */
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

/**
 * 🔒 IP WHITELIST MIDDLEWARE
 * 
 * Only allows requests from whitelisted IPs
 * Use for highly sensitive endpoints like admin panel
 * 
 * ⚠️ WARNING: Make sure your IP is in whitelist before applying!
 */
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

/**
 * 🚫 IP BLACKLIST MIDDLEWARE
 * 
 * Blocks requests from blacklisted IPs
 * Use globally to block known malicious actors
 */
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

/**
 * 🌍 REGIONAL ACCESS CONTROL
 * 
 * Allow/block based on geographic location
 * Requires GeoIP database (not implemented here)
 * 
 * Example with maxmind geoip library:
 * ```typescript
 * import geoip from 'geoip-lite';
 * 
 * export const allowOnlyRegions = (allowedCountries: string[]) => {
 *   return (req: Request, res: Response, next: NextFunction) => {
 *     const clientIp = getClientIp(req);
 *     const geo = geoip.lookup(clientIp);
 *     
 *     if (!geo || !allowedCountries.includes(geo.country)) {
 *       throw new AppError('Access denied from your region.', 403);
 *     }
 *     
 *     next();
 *   };
 * };
 * ```
 */

/**
 * 🔧 DYNAMIC IP MANAGEMENT
 * 
 * In production, you may want to store IPs in database
 * This allows dynamic updates without redeploying
 */
interface IpAccessControl {
    ip: string;
    type: 'whitelist' | 'blacklist';
    reason?: string;
    expiresAt?: Date;
    createdAt: Date;
}

/**
 * Example: Get blacklist from database
 * 
 * ```typescript
 * export const dynamicIpBlacklist = async (req: Request, res: Response, next: NextFunction) => {
 *   const clientIp = getClientIp(req);
 *   
 *   // Query database
 *   const blocked = await IpAccessControlModel.findOne({
 *     ip: clientIp,
 *     type: 'blacklist',
 *     $or: [
 *       { expiresAt: null },
 *       { expiresAt: { $gt: new Date() } }
 *     ]
 *   });
 *   
 *   if (blocked) {
 *     throw new AppError('Access denied.', 403);
 *   }
 *   
 *   next();
 * };
 * ```
 */

/**
 * 📊 IP LOGGING & MONITORING
 * 
 * Track suspicious IP behavior
 */
export const logIpAccess = (req: Request, res: Response, next: NextFunction) => {
    const clientIp = getClientIp(req);
    const userAgent = req.headers['user-agent'];
    
    // Log access for monitoring (in production, send to logging service)
    console.log(`📍 IP Access: ${clientIp} | ${req.method} ${req.originalUrl} | UA: ${userAgent}`);
    
    // Store in database for analysis (optional)
    // await IpAccessLogModel.create({
    //   ip: clientIp,
    //   method: req.method,
    //   url: req.originalUrl,
    //   userAgent,
    //   timestamp: new Date()
    // });
    
    next();
};

/**
 * 🎯 USAGE EXAMPLES:
 * 
 * 1. Protect admin routes with whitelist:
 * ```typescript
 * router.use('/admin', ipWhitelist, adminRoutes);
 * ```
 * 
 * 2. Block malicious IPs globally:
 * ```typescript
 * app.use(ipBlacklist);
 * ```
 * 
 * 3. Combine with authentication:
 * ```typescript
 * router.delete('/users/:id',
 *   ipWhitelist,      // Only from office
 *   protect,          // Must be authenticated
 *   admin,            // Must be admin
 *   userController.delete
 * );
 * ```
 * 
 * 4. Log all API access:
 * ```typescript
 * app.use('/api', logIpAccess);
 * ```
 */

/**
 * 🚨 IMPORTANT NOTES:
 * 
 * 1. REVERSE PROXY:
 *    If behind nginx/CloudFlare, make sure X-Forwarded-For is set correctly
 *    Configure nginx: proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
 * 
 * 2. LOCALHOST TESTING:
 *    Always include localhost IPs in whitelist for development
 * 
 * 3. DYNAMIC IPS:
 *    Home/mobile IPs change frequently - consider VPN for remote access
 * 
 * 4. IPv6:
 *    Make sure to handle both IPv4 and IPv6 formats
 * 
 * 5. CLOUDFLARE/CDN:
 *    Use CF-Connecting-IP header for CloudFlare
 *    Trust proxy setting: app.set('trust proxy', true);
 */

/**
 * 📈 PRODUCTION RECOMMENDATIONS:
 * 
 * 1. Store IP lists in database for easy management
 * 2. Add expiration for temporary blocks
 * 3. Implement automatic blacklisting based on behavior:
 *    - Multiple failed login attempts
 *    - Rate limit violations
 *    - Suspicious patterns
 * 4. Use GeoIP for regional restrictions
 * 5. Log all blocked attempts for analysis
 * 6. Set up alerts for repeated block attempts
 * 7. Regular review and cleanup of blacklist
 */

/**
 * 🔍 MONITORING BLOCKED IPS:
 * 
 * Query patterns:
 * - Most blocked IPs
 * - Blocked IP geographic distribution
 * - Endpoints most targeted by blocked IPs
 * - Time patterns of attacks
 * 
 * Use this data to:
 * - Identify attack patterns
 * - Update security rules
 * - Report to ISP/authorities
 */

export { getClientIp };
