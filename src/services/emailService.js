import logger from '~/config/logger';
import nodemailer from 'nodemailer';
import { NODE_ENV, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USERNAME, EMAIL_FROM } from '~/config/env';

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
		.catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

export const sendEmail = async (to, subject, html) => {
	const msg = { from: `De4th Zone <${EMAIL_FROM}>`, to, subject, html };
	await transport.sendMail(msg);
};

export const sendResetPasswordEmail = async (to, token) => {
	const subject = 'Reset password';
	// replace this url with the link to the reset password page of your front-end app
	const resetPasswordUrl = `https://de4thzone.com/reset-password?token=${token}`;
	const html = `Dear user,
    To reset your password, click on this link: ${resetPasswordUrl}
    If you did not request any password resets, then ignore this email.`;
	await sendEmail(to, subject, html);
};

export const sendVerificationEmail = async (to, token) => {
	const subject = 'Email Verification';
	// replace this url with the link to the email verification page of your front-end app
	const verificationEmailUrl = `https://de4thzone.com/verify-email?token=${token}`;
	const html = `Dear user,
    To verify your email, click on this link: ${verificationEmailUrl}
    If you did not create an account, then ignore this email.`;
	await sendEmail(to, subject, html);
};
