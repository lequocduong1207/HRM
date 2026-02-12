import helmet from 'helmet';

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

// Development-friendly Helmet configuration
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

// API-specific Helmet configuration
// For pure API servers (no HTML rendering)

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