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

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 'loopback, linklocal, uniquelocal');
} else {
    app.set('trust proxy', false);
}

const helmetConfig = process.env.NODE_ENV === 'production' 
  ? productionHelmetConfig 
  : developmentHelmetConfig;

app.use(helmetConfig);

app.use(ipBlacklist);

if (process.env.NODE_ENV === 'production') {
    app.use('/api', logIpAccess);
}

const allowOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
];


app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}.`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api', readOperationsLimiter);
app.use('/api', apiLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(mongoSanitizeMiddleware);
app.use(sanitizeStrings);

app.use('/api', validateRequest);

app.use(compression());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


if (process.env.NODE_ENV === 'development') {
    app.use((req: Request, res: Response, next: NextFunction) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
    });
}

app.get('/api/v1', (req: Request, res: Response) => {
    res.json({
        message: 'HRM API Server'
    });
});

app.get('/v1/health', (req: Request, res: Response) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.use('/api', apiRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;