import helmet from 'helmet';

/**
 * 🛡️ ADVANCED SECURITY HEADERS CONFIGURATION
 * 
 * Helmet helps secure Express apps by setting various HTTP headers.
 * This configuration provides enhanced security for production environments.
 */

/**
 * 🔒 SECURITY HEADERS EXPLAINED:
 * 
 * 1. Content-Security-Policy (CSP)
 *    - Prevents XSS attacks by controlling resource loading
 *    - Defines which sources are allowed for scripts, styles, images, etc.
 * 
 * 2. X-Frame-Options
 *    - Prevents clickjacking attacks
 *    - Stops your site from being embedded in iframes
 * 
 * 3. X-Content-Type-Options
 *    - Prevents MIME type sniffing
 *    - Forces browser to respect declared content type
 * 
 * 4. Strict-Transport-Security (HSTS)
 *    - Forces HTTPS connections
 *    - Prevents protocol downgrade attacks
 * 
 * 5. X-Permitted-Cross-Domain-Policies
 *    - Controls how Flash/PDF can access your site
 * 
 * 6. Referrer-Policy
 *    - Controls how much referrer information is shared
 * 
 * 7. X-DNS-Prefetch-Control
 *    - Controls DNS prefetching to prevent privacy leaks
 */

/**
 * 🎯 PRODUCTION SECURITY HEADERS
 * 
 * Use this configuration for production environments
 */
export const productionHelmetConfig = helmet({
    // Content Security Policy
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"], // Default: only same origin
            scriptSrc: [
                "'self'", 
                "'unsafe-inline'", // Allow inline scripts (needed for some frameworks)
                "https://trusted-cdn.com" // Add your trusted CDN domains
            ],
            styleSrc: [
                "'self'", 
                "'unsafe-inline'", // Allow inline styles (needed for styled-components, etc.)
                "https://fonts.googleapis.com"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com"
            ],
            imgSrc: [
                "'self'", 
                "data:", // Allow data: URLs for images
                "https:" // Allow HTTPS images
            ],
            connectSrc: [
                "'self'",
                "https://api.yourdomain.com" // Your API domain
            ],
            frameSrc: ["'none'"], // Disallow iframes
            objectSrc: ["'none'"], // Disallow plugins (Flash, etc.)
            upgradeInsecureRequests: [] // Upgrade HTTP to HTTPS
        }
    },

    // HTTP Strict Transport Security (HSTS)
    // Forces HTTPS for 1 year, including subdomains
    strictTransportSecurity: {
        maxAge: 31536000, // 1 year in seconds
        includeSubDomains: true,
        preload: true // Submit to HSTS preload list
    },

    // X-Frame-Options: Prevent clickjacking
    // DENY = Cannot be displayed in iframe at all
    // SAMEORIGIN = Can be displayed in iframe only on same origin
    frameguard: {
        action: 'deny'
    },

    // X-Content-Type-Options: Prevent MIME sniffing
    noSniff: true,

    // X-XSS-Protection: Enable XSS filter
    // (Legacy, CSP is better, but keep for old browsers)
    xssFilter: true,

    // Referrer-Policy: Control referrer information
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin'
    },

    // X-DNS-Prefetch-Control: Disable DNS prefetching
    dnsPrefetchControl: {
        allow: false
    },

    // X-Download-Options: Prevent IE from MIME-sniffing downloads
    ieNoOpen: true,

    // X-Permitted-Cross-Domain-Policies: Restrict Flash/PDF access
    permittedCrossDomainPolicies: {
        permittedPolicies: 'none'
    },

    // Hide X-Powered-By header (don't reveal Express)
    hidePoweredBy: true
});

/**
 * 🔧 DEVELOPMENT SECURITY HEADERS
 * 
 * Relaxed configuration for development environments
 * - Allows inline scripts/styles (for hot reload)
 * - Allows unsafe-eval (for dev tools)
 * - Less strict CSP
 */
export const developmentHelmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "'unsafe-eval'" // Allow eval (needed for dev tools)
            ],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "ws:", "wss:"], // Allow WebSocket (for hot reload)
            fontSrc: ["'self'", "data:"],
        }
    },
    
    // Less strict HSTS for development
    strictTransportSecurity: false,
    
    // Allow iframes for development tools
    frameguard: {
        action: 'sameorigin'
    },
    
    noSniff: true,
    xssFilter: true,
    dnsPrefetchControl: { allow: false },
    hidePoweredBy: true
});

/**
 * 🎨 API-SPECIFIC CONFIGURATION
 * 
 * For pure API servers (no HTML rendering)
 */
export const apiHelmetConfig = helmet({
    contentSecurityPolicy: false, // Not needed for API-only
    
    strictTransportSecurity: {
        maxAge: 31536000,
        includeSubDomains: true
    },
    
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'no-referrer' },
    hidePoweredBy: true
});

/**
 * 📊 HELMET HEADERS SUMMARY:
 * 
 * When helmet is applied, your responses will include:
 * 
 * ```http
 * Content-Security-Policy: default-src 'self'; script-src 'self' ...
 * Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
 * X-Frame-Options: DENY
 * X-Content-Type-Options: nosniff
 * X-XSS-Protection: 1; mode=block
 * Referrer-Policy: strict-origin-when-cross-origin
 * X-DNS-Prefetch-Control: off
 * X-Download-Options: noopen
 * X-Permitted-Cross-Domain-Policies: none
 * ```
 */

/**
 * 🎯 USAGE IN APP.TS:
 * 
 * ```typescript
 * import { productionHelmetConfig, developmentHelmetConfig } from './middlewares/security/helmet.middleware.js';
 * 
 * // Choose config based on environment
 * const helmetConfig = process.env.NODE_ENV === 'production' 
 *   ? productionHelmetConfig 
 *   : developmentHelmetConfig;
 * 
 * app.use(helmetConfig);
 * ```
 */

/**
 * 🚨 COMMON CSP ISSUES & SOLUTIONS:
 * 
 * 1. Issue: "Refused to load the script because it violates CSP"
 *    Solution: Add the domain to scriptSrc directive
 *    
 * 2. Issue: "Refused to execute inline script"
 *    Solution: Use nonce or hash, or add 'unsafe-inline' (not recommended)
 *    
 * 3. Issue: "Refused to connect to WebSocket"
 *    Solution: Add 'ws:' or 'wss:' to connectSrc
 *    
 * 4. Issue: CORS errors after adding helmet
 *    Solution: Helmet doesn't affect CORS, check your CORS middleware
 */

/**
 * 🔍 TESTING SECURITY HEADERS:
 * 
 * 1. Online tools:
 *    - https://securityheaders.com
 *    - https://observatory.mozilla.org
 * 
 * 2. Browser DevTools:
 *    - Network tab → Select response → Headers
 *    - Console will show CSP violations
 * 
 * 3. Command line:
 *    ```bash
 *    curl -I https://your-api.com/api/v1/health
 *    ```
 */

/**
 * 📈 SECURITY GRADES:
 * 
 * With this configuration, you should achieve:
 * - securityheaders.com: A+ grade
 * - Mozilla Observatory: A+ grade
 * - SSL Labs: A grade (with proper SSL config)
 */
