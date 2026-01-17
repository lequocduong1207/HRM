import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import apiRoutes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';
import { errorHandler } from './middlewares/index.js';
import { notFoundHandler } from './middlewares/index.js';
import { mongoSanitizeMiddleware, sanitizeStrings } from './middlewares/security/sanitize.middleware.js';
import { apiLimiter, readOperationsLimiter } from './middlewares/security/rate-limit.middleware.js';
import { productionHelmetConfig, developmentHelmetConfig } from './middlewares/security/helmet.middleware.js';
import { validateRequest } from './middlewares/security/request-validation.middleware.js';
import { ipBlacklist, logIpAccess } from './middlewares/security/ip-filter.middleware.js';

const app: Application = express();

// ============================================
// ⚙️ EXPRESS CONFIGURATION
// ============================================

// Trust proxy - Important when behind nginx/CloudFlare
// This allows us to get real client IP from X-Forwarded-For header
// Options:
// - false: Don't trust any proxy (default)
// - true: Trust all proxies (NOT RECOMMENDED - security risk)
// - number: Trust the nth hop from the front-facing proxy
// - string: Trust specific IP/CIDR ranges
// - function: Custom trust logic
if (process.env.NODE_ENV === 'production') {
    // Production: Only trust specific proxy IPs (e.g., nginx, CloudFlare)
    // Update these IPs to match your infrastructure
    app.set('trust proxy', 'loopback, linklocal, uniquelocal');
} else {
    // Development: No proxy trust needed
    app.set('trust proxy', false);
}

// ============================================
// 🔒 SECURITY MIDDLEWARES (Order matters!)
// ============================================

// 1. Advanced Helmet - Security headers
// Choose configuration based on environment
const helmetConfig = process.env.NODE_ENV === 'production' 
  ? productionHelmetConfig 
  : developmentHelmetConfig;

app.use(helmetConfig);

// 2. IP Access Control - Block malicious IPs
app.use(ipBlacklist);

// 3. IP Logging - Track all access (optional, for monitoring)
if (process.env.NODE_ENV === 'production') {
    app.use('/api', logIpAccess);
}

// 4. CORS - Cross-Origin Resource Sharing
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 5. Rate Limiting - Prevent brute force & DDoS
// Apply read limiter first (more permissive for GET)
app.use('/api', readOperationsLimiter);
// Then apply general limiter for all methods
app.use('/api', apiLimiter);

// 6. Body Parser - Parse JSON and URL-encoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 7. Input Sanitization - Prevent NoSQL Injection & XSS
// MUST be after body parser!
app.use(mongoSanitizeMiddleware);
app.use(sanitizeStrings);

// 8. Request Validation - Prevent DoS via large payloads
app.use('/api', validateRequest);

// 9. Compression - Gzip response 
app.use(compression());

// ============================================
// 📚 SWAGGER DOCUMENTATION
// ============================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ============================================
// 🔍 DEVELOPMENT LOGGING
// ============================================

if (process.env.NODE_ENV === 'development') {
    app.use((req: Request, res: Response, next: NextFunction) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
    });
}

/**
 * @route   GET /
 * @desc    Root endpoint
 * @access  Public
 */

app.get('/api/v1', (req: Request, res: Response) => {
    res.json({
        message: 'HRM API Server'
    });
});

/**
 * @route   GET /health
 * @desc    Health check
 * @access  Public
 */
app.get('/v1/health', (req: Request, res: Response) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes
app.use('/api', apiRoutes);

// 404 Not Found Handler
app.use(notFoundHandler);

// Global Error Handler (phải để cuối cùng)
app.use(errorHandler);

export default app;