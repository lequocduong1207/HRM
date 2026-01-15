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
 * Giới hạn: 100 requests / 15 phút / IP
 * - Đủ rộng cho user bình thường
 * - Vẫn ngăn chặn abuse
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            error: 'Rate limit exceeded. Please try again later.',
            retryAfter: '15 minutes'
        });
    }
});

/**
 * 🔵 CREATE/UPDATE RATE LIMITER - Cho write operations
 * 
 * Sử dụng cho: POST, PUT, PATCH, DELETE
 * 
 * Giới hạn: 30 requests / 15 phút / IP
 * - Write operations tốn resource hơn read
 * - Giới hạn chặt hơn để tránh spam
 */
export const writeOperationsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30,
    message: {
        success: false,
        error: 'Too many write operations from this IP'
    },
    standardHeaders: true,
    legacyHeaders: false,
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
 * 1. TIERED APPROACH:
 *    - Auth endpoints: Rất chặt (5/15min)
 *    - Sensitive ops: Chặt (10/15min)
 *    - Write ops: Vừa (30/15min)
 *    - Read ops: Rộng (100/15min)
 * 
 * 2. SKIP AUTHENTICATED USERS (optional):
 *    - Có thể skip rate limit cho authenticated users
 *    - Or tăng limit cho authenticated users
 * 
 * 3. WHITELIST IPS (optional):
 *    - Cho phép internal IPs bypass rate limit
 *    - Skip cho monitoring/health check endpoints
 * 
 * 4. DISTRIBUTED SYSTEMS:
 *    - Hiện tại dùng memory store (single server)
 *    - Production: Nên dùng Redis store (multi-server)
 * 
 * 5. MONITORING:
 *    - Log rate limit hits
 *    - Alert khi có IP hit rate limit nhiều lần
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
 */
