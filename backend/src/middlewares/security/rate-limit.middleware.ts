import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * ⚡ RATE LIMITING CONFIGURATION
 * 
 * Rate limiting là kỹ thuật giới hạn số lượng requests từ một IP trong khoảng thời gian nhất định
 * để ngăn chặn:
 * - Brute force attacks (thử mật khẩu nhiều lần)
 * - DDoS attacks
 * - API abuse
 * - Resource exhaustion
 */

/**
 * 🔴 STRICT RATE LIMITER - Cho authentication endpoints
 * 
 * Sử dụng cho: /api/v1/auth/login, /api/v1/auth/register
 * 
 * Giới hạn: 5 requests / 15 phút / IP
 * - windowMs: 15 * 60 * 1000 = 900,000ms = 15 phút
 * - max: 5 requests
 * 
 * ⚠️ Tại sao cần strict?
 * - Login/Register là target chính của brute force
 * - 5 lần thử/15 phút đủ cho user bình thường
 * - Attacker cần 15 phút để thử tiếp → làm chậm attack
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs
    message: {
        success: false,
        error: 'Too many login attempts from this IP, please try again after 15 minutes'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Skip successful requests from counting
    skipSuccessfulRequests: false,
    // Skip failed requests from counting
    skipFailedRequests: false,
    // Validate trust proxy configuration
    validate: { trustProxy: false }, // Skip validation for trust proxy
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            error: 'Too many authentication attempts. Please try again after 15 minutes.',
            retryAfter: '15 minutes'
        });
    }
});

/**
 * 🟡 MODERATE RATE LIMITER - Cho sensitive operations
 * 
 * Sử dụng cho:
 * - Password reset requests
 * - Email verification requests
 * - Profile updates
 * 
 * Giới hạn: 10 requests / 15 phút / IP
 */
export const sensitiveOperationsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
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

/**
 * 🟢 GENERAL API RATE LIMITER - Cho general API calls
 * 
 * Sử dụng cho: Tất cả các API endpoints khác
 * 
 * Giới hạn: 300 requests / 15 phút / IP
 * - Đủ rộng cho user bình thường load trang nhiều lần
 * - Vẫn ngăn chặn abuse
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // 300 requests per windowMs - rộng hơn cho UX tốt hơn
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

/**
 * 🔷 READ OPERATIONS LIMITER - Cho GET requests
 * 
 * Sử dụng cho: Tất cả GET endpoints
 * 
 * Giới hạn: 500 requests / 15 phút / IP
 * - Read operations ít tốn resource hơn write
 * - Cho phép load trang nhiều lần mà không bị block
 * - Vẫn đủ để ngăn web scraping
 */
export const readOperationsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // 500 GET requests per 15 minutes
    message: {
        success: false,
        error: 'Too many read requests from this IP'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
    // Chỉ apply cho GET methods
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

/**
 * 🔵 CREATE/UPDATE RATE LIMITER - Cho write operations
 * 
 * Sử dụng cho: POST, PUT, PATCH, DELETE
 * 
 * Giới hạn: 50 requests / 15 phút / IP
 * - Write operations tốn resource hơn read
 * - Giới hạn chặt hơn để tránh spam
 * - Tăng lên 50 để thoải mái hơn cho admin operations
 */
export const writeOperationsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Tăng từ 30 lên 50 cho admin operations
    message: {
        success: false,
        error: 'Too many write operations from this IP'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
    // Chỉ apply cho write methods
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

/**
 * 🟣 ADMIN OPERATIONS LIMITER - Cho admin routes
 * 
 * Sử dụng cho: Admin dashboard operations
 * 
 * Giới hạn: 1000 requests / 15 phút / IP
 * - Admin cần tương tác nhiều với hệ thống
 * - Vẫn đủ để ngăn chặn abuse nếu account bị hack
 * - Áp dụng sau khi verify token admin
 */
export const adminOperationsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Rất rộng cho admin
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

/**
 * 📊 RESPONSE HEADERS EXPLAINED:
 * 
 * Khi rate limit được apply, response sẽ có headers:
 * 
 * RateLimit-Limit: 100          → Tổng số requests được phép
 * RateLimit-Remaining: 95       → Số requests còn lại
 * RateLimit-Reset: 1234567890   → Timestamp khi reset (Unix epoch)
 * 
 * Khi vượt giới hạn:
 * Status: 429 Too Many Requests
 * Retry-After: 900              → Số giây phải chờ
 */

/**
 * 🎯 BEST PRACTICES:
 * 
 * 1. TIERED APPROACH - Phân tầng theo mức độ nhạy cảm:
 *    - Auth endpoints: Rất chặt (5/15min) - Chống brute force
 *    - Sensitive ops: Chặt (10/15min) - Password reset, verification
 *    - Write ops: Vừa (50/15min) - POST/PUT/PATCH/DELETE
 *    - Admin ops: Rộng (1000/15min) - Admin dashboard
 *    - Read ops: Rất rộng (500/15min) - GET requests
 *    - General API: Rộng (300/15min) - Default cho mọi route
 * 
 * 2. METHOD-BASED LIMITING:
 *    - GET requests: Limit cao (500/15min) - Ít tốn resource
 *    - POST/PUT/PATCH/DELETE: Limit thấp hơn (50/15min) - Tốn resource
 *    - Dùng skip() function để phân biệt
 * 
 * 3. SKIP AUTHENTICATED USERS (Recommended):
 *    - Có thể skip/tăng limit cho authenticated users
 *    - Example:
 *      ```
 *      skip: (req) => req.user?.role === 'admin'
 *      ```
 * 
 * 4. WHITELIST IPS (Optional):
 *    - Cho phép internal IPs/VPN bypass rate limit
 *    - Skip cho monitoring/health check endpoints
 *    - Example:
 *      ```
 *      skip: (req) => {
 *        const trustedIPs = ['192.168.1.0/24', '10.0.0.0/8'];
 *        return trustedIPs.includes(req.ip);
 *      }
 *      ```
 * 
 * 5. BYPASS FOR SPECIFIC ROUTES:
 *    - Health check: /api/health, /api/ping
 *    - Static assets: /public/*
 *    - Websockets: /socket.io/*
 * 
 * 6. DISTRIBUTED SYSTEMS:
 *    - Hiện tại dùng memory store (single server)
 *    - Production: Nên dùng Redis store (multi-server)
 * 
 * 7. MONITORING & ALERTS:
 *    - Log rate limit hits vào audit log
 *    - Alert khi có IP hit rate limit nhiều lần
 *    - Track patterns để điều chỉnh limits
 * 
 * 8. USER FEEDBACK:
 *    - Trả về clear error messages
 *    - Include Retry-After header
 *    - Show remaining requests in headers
 */

/**
 * 🔧 PRODUCTION CONFIGURATION:
 * 
 * Khi deploy production với nhiều servers, nên dùng Redis store:
 * 
 * ```typescript
 * import RedisStore from 'rate-limit-redis';
 * import { createClient } from 'redis';
 * 
 * const redisClient = createClient({
 *   url: process.env.REDIS_URL
 * });
 * 
 * export const authLimiter = rateLimit({
 *   store: new RedisStore({
 *     client: redisClient,
 *     prefix: 'rl:auth:'
 *   }),
 *   windowMs: 15 * 60 * 1000,
 *   max: 5
 * });
 * ```
 * 
 * 📝 USAGE EXAMPLE:
 * 
 * ```typescript
 * // Apply different limiters to different routes
 * app.post('/api/v1/auth/login', authLimiter, loginController);
 * app.get('/api/v1/users', readOperationsLimiter, getUsersController);
 * app.post('/api/v1/users', writeOperationsLimiter, createUserController);
 * app.use('/api/v1/admin', verifyAdmin, adminOperationsLimiter);
 * 
 * // Default limiter for all API routes
 * app.use('/api', apiLimiter);
 * ```
 * 
 * 🚀 PERFORMANCE TIPS:
 * 
 * 1. Order limiters từ specific đến general:
 *    - Auth routes trước (strict)
 *    - Admin routes giữa (loose)
 *    - General API sau (moderate)
 * 
 * 2. Skip health checks và monitoring:
 *    ```
 *    skip: (req) => req.path === '/api/health'
 *    ```
 * 
 * 3. Combine với CDN/Reverse Proxy rate limiting:
 *    - CloudFlare, Nginx có rate limiting riêng
 *    - Use multiple layers of protection */