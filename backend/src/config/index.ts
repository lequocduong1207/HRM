import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
      path: path.resolve(process.cwd(), `.env`)
});

const config = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL as string,
  jwt: {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.JWT_EXPIRES_IN,
  },
};

export default config;