import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'development';

export const APP_NAME = process.env.APP_NAME || 'App Name';

export const HOST = process.env.HOST || '0.0.0.0';
export const PORT = process.env.PORT || 666;

export const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/database';

export const JWT_ACCESS_TOKEN_SECRET_PRIVATE = Buffer.from(process.env.JWT_ACCESS_TOKEN_SECRET_PRIVATE, 'base64') || '';
export const JWT_ACCESS_TOKEN_SECRET_PUBLIC = Buffer.from(process.env.JWT_ACCESS_TOKEN_SECRET_PUBLIC, 'base64') || '';
export const JWT_ACCESS_TOKEN_EXPIRATION_MINUTES = process.env.JWT_ACCESS_TOKEN_EXPIRATION_MINUTES || 240;

export const REFRESH_TOKEN_EXPIRATION_DAYS = process.env.REFRESH_TOKEN_EXPIRATION_DAYS || 1;
export const VERIFY_EMAIL_EXPIRATION_MINUTES = process.env.VERIFY_EMAIL_EXPIRATION_MINUTES || 60;
export const RESET_PASSWORD_EXPIRATION_MINUTES = process.env.RESET_PASSWORD_EXPIRATION_MINUTES || 30;

export const SMTP_HOST = process.env.SMTP_HOST || '';
export const SMTP_PORT = process.env.SMTP_PORT || '';
export const SMTP_USERNAME = process.env.SMTP_USERNAME || '';
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
export const EMAIL_FROM = process.env.EMAIL_FROM || '';

export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:777';

export const IMAGE_URL = process.env.IMAGE_URL || 'http://localhost:666/images';

export const TOKEN_TYPES = {
	REFRESH: 'refresh',
	VERIFY_EMAIL: 'verifyEmail',
	RESET_PASSWORD: 'resetPassword'
};
