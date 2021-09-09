import nodemailer from 'nodemailer';
import logger from '~/config/logger';
import * as template from '~/config/template';
import { NODE_ENV, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USERNAME, EMAIL_FROM, APP_NAME, FRONTEND_URL } from '~/config/env';

export const transport = nodemailer.createTransport({
	host: SMTP_HOST,
	port: SMTP_PORT,
	secure: true,
	auth: {
		user: SMTP_USERNAME,
		pass: SMTP_PASSWORD
	}
});

if (NODE_ENV !== 'test') {
	transport
		.verify()
		.then(() => logger.info('Connected to email server'))
		.catch(() => logger.warn('Unable to connect to email server'));
}

export const sendEmail = async (to, subject, html) => {
	const msg = { from: `${APP_NAME} <${EMAIL_FROM}>`, to, subject, html };
	await transport.sendMail(msg);
};

export const sendResetPasswordEmail = async (to, token) => {
	const subject = 'Reset password';
	const resetPasswordUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
	const html = template.resetPassword(resetPasswordUrl, APP_NAME);
	await sendEmail(to, subject, html);
};

export const sendVerificationEmail = async (to, token) => {
	const subject = 'Email Verification';
	const verificationEmailUrl = `${FRONTEND_URL}/verify-email?token=${token}`;
	const html = template.verifyEmail(verificationEmailUrl, APP_NAME);
	await sendEmail(to, subject, html);
};
