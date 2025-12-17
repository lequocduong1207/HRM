import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import apiRoutes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';
import { errorHandler } from './middlewares/index.js';
import { notFoundHandler } from './middlewares/index.js';

const app: Application = express();

// Helmet - Security headers
app.use(helmet());

// CORS - Cross-Origin Resource Sharing
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Compression - Gzip response 
app.use(compression());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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