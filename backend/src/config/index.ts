import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
      path: path.resolve(process.cwd(), `.env`)
});

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

const config = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL as string,
  jwt: {
      secret: process.env.JWT_SECRET as string,
      refreshSecret: process.env.JWT_REFRESH_SECRET as string,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
};

export default config;