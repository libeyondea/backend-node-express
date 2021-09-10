import APIError from '~/utils/apiError';
import * as tokenService from '~/services/tokenService';
import * as emailService from '~/services/emailService';
import User from '~/models/user';
import { TOKEN_TYPES } from '~/config/env';
import httpStatus from 'http-status';
import Token from '~/models/token';

export const signup = async (req, res) => {
	const user = await User.createUser(req.body);
	const tokens = await tokenService.generateAuthTokens(user);
	return res.json({
		success: true,
		data: { user, tokens }
	});
};

export const signin = async (req, res) => {
	const { userName, password } = req.body;
	const user = await User.signinWithUserNameAndPassword(userName, password);
	const tokens = await tokenService.generateAuthTokens(user);
	return res.json({
		success: true,
		data: { user, tokens }
	});
};

export const me = async (req, res) => {
	return res.json({
		success: true,
		data: {
			id: req.user.id,
			firstName: req.user.firstName,
			lastName: req.user.lastName,
			userName: req.user.userName,
			email: req.user.email,
			avatar: req.user.avatar,
			role: req.user.role
		}
	});
};

export const logout = async (req, res) => {
	await Token.revokeToken(req.body.refreshToken);
	return res.json({
		success: true,
		data: 'Logout success'
	});
};

export const refreshTokens = async (req, res) => {
	try {
		const refreshTokenDoc = await tokenService.verifyToken(req.body.refreshToken, TOKEN_TYPES.REFRESH);
		const user = await User.getUserById(refreshTokenDoc.user);
		if (!user) {
			throw new APIError(httpStatus[401], 401, true);
		}
		await refreshTokenDoc.remove();
		const tokens = await tokenService.generateAuthTokens(user);
		return res.json({
			success: true,
			data: {
				tokens
			}
		});
	} catch (err) {
		throw new APIError('Refresh failed', 401, true);
	}
};

export const sendVerificationEmail = async (req, res) => {
	const user = await User.getUserByEmail(req.user.email);
	if (user.confirmed) {
		throw new APIError('Email verified', 400, true);
	}
	const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
	await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
	return res.json({
		success: true,
		data: 'Send verification email success'
	});
};

export const verifyEmail = async (req, res) => {
	try {
		const verifyEmailTokenDoc = await tokenService.verifyToken(req.query.token, TOKEN_TYPES.VERIFY_EMAIL);
		const user = await User.getUserById(verifyEmailTokenDoc.user);
		if (!user) {
			throw new Error();
		}
		await Token.deleteMany({ user: user.id, type: TOKEN_TYPES.VERIFY_EMAIL });
		await User.updateUserById(user.id, { confirmed: true });
		return res.json({
			success: true,
			data: 'Verify email success'
		});
	} catch (err) {
		throw new APIError('Email verification failed', 401, true);
	}
};

export const forgotPassword = async (req, res) => {
	const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
	await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
	return res.json({
		success: true,
		data: 'Send forgot password email success'
	});
};

export const resetPassword = async (req, res) => {
	try {
		const resetPasswordTokenDoc = await tokenService.verifyToken(req.query.token, TOKEN_TYPES.RESET_PASSWORD);
		const user = await User.getUserById(resetPasswordTokenDoc.user);
		if (!user) {
			throw new Error();
		}
		await Token.deleteMany({ user: user.id, type: TOKEN_TYPES.RESET_PASSWORD });
		await User.updateUserById(user.id, { password: req.body.password });
		return res.json({
			success: true,
			data: 'Reset password success'
		});
	} catch (err) {
		throw new APIError('Password reset failed', 401, true);
	}
};
