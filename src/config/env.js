import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const HOST = process.env.HOST || '0.0.0.0';
export const PORT = process.env.PORT || 666;

export const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/auth';

export const JWT_SECRET_KEY = process.env.SECRET_KEY || 'de4thzone';
export const JWT_ACCESS_EXPIRATION_MINUTES = process.env.JWT_ACCESS_EXPIRATION_MINUTES || 66;
export const JWT_REFRESH_EXPIRATION_DAYS = process.env.JWT_REFRESH_EXPIRATION_DAYS || 1;
