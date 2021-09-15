import APIError from '~/utils/apiError';
import * as tokenService from '~/services/tokenService';
import * as emailService from '~/services/emailService';
import User from '~/models/userModel';
import { TOKEN_TYPES } from '~/config/env';
import httpStatus from 'http-status';
import Token from '~/models/tokenModel';
import Role from '~/models/roleModel';

export const signup = async (req, res) => {
	const role = await Role.getRoleByName('User');
	req.body.roles = [role.id];
	const user = await User.createUser(req.body);
	const tokens = await tokenService.generateAuthTokens(user);
	return res.json({
		success: true,
		data: { user, tokens }
	});
};

export const signin = async (req, res) => {
	const user = await User.getUserByUserName(req.body.userName);
	if (!user || !(await user.isPasswordMatch(req.body.password))) {
		throw new APIError('Incorrect user name or password', httpStatus.BAD_REQUEST);
	}
	const tokens = await tokenService.generateAuthTokens(user);
	return res.json({
		success: true,
		data: { user, tokens }
	});
};

export const getMe = async (req, res) => {
	const user = await User.getUserByIdWithRoles(req.user.id);
	if (!user) {
		throw new APIError('User not found', httpStatus.NOT_FOUND);
	}
	return res.json({
		success: true,
		data: user
	});
};

export const updateMe = async (req, res) => {
	const user = await User.updateUserById(req.user.id, req.body);
	return res.json({
		success: true,
		data: user
	});
};

export const logout = async (req, res) => {
	await Token.revokeToken(req.body.refreshToken, TOKEN_TYPES.REFRESH);
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
			throw new Error();
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
		throw new APIError(err.message, httpStatus.UNAUTHORIZED);
	}
};

export const sendVerificationEmail = async (req, res) => {
	const user = await User.getUserByEmail(req.user.email);
	if (user.confirmed) {
		throw new APIError('Email verified', httpStatus.BAD_REQUEST);
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
		throw new APIError('Email verification failed', httpStatus.UNAUTHORIZED);
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
		throw new APIError('Password reset failed', httpStatus.UNAUTHORIZED);
	}
};
