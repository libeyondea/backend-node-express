import * as userService from './userService';
import * as tokenService from './tokenService';
import httpStatus from 'http-status';
import APIError from '~/utils/apiError';
import User from '~/models/user';
import Role from '~/models/role';
import Token from '~/models/token';
import { TOKEN_TYPES } from '~/config/env';

export const signinWithUserNameAndPassword = async (userName, password) => {
	const user = await userService.getUserByUserName(userName);
	if (!user || !(await user.isPasswordMatch(password))) {
		throw new APIError('Incorrect user name or password', 400, true);
	}
	return user;
};

export const signup = async (body) => {
	if (await User.isUserNameAlreadyExists(body.userName)) {
		throw new APIError('User name already exists', 400, true);
	}
	if (await User.isEmailAlreadyExists(body.email)) {
		throw new APIError('Email already exists', 400, true);
	}
	const role = await Role.findOne({ name: 'User' });
	if (role) {
		body.roles = role.id;
	}
	return User.create(body);
};

export const logout = async (refreshToken) => {
	const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: TOKEN_TYPES.REFRESH, blacklisted: false });
	if (!refreshTokenDoc) {
		throw new APIError('Token not found', 400, true);
	}
	await refreshTokenDoc.remove();
};

export const refreshTokens = async (refreshToken) => {
	try {
		const refreshTokenDoc = await tokenService.verifyToken(refreshToken, TOKEN_TYPES.REFRESH);
		const user = await userService.getUserById(refreshTokenDoc.user);
		if (!user) {
			throw new APIError(httpStatus[401], 401, true);
		}
		await refreshTokenDoc.remove();
		return tokenService.generateAuthTokens(user);
	} catch (err) {
		throw new APIError('Refresh failed', 401, true);
	}
};

export const verifyEmail = async (verifyEmailToken) => {
	try {
		const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, TOKEN_TYPES.VERIFY_EMAIL);
		const user = await userService.getUserById(verifyEmailTokenDoc.user);
		if (!user) {
			throw new Error();
		}
		await Token.deleteMany({ user: user.id, type: TOKEN_TYPES.VERIFY_EMAIL });
		await userService.updateUserById(user.id, { confirmed: true });
	} catch (err) {
		throw new APIError('Email verification failed', 401, true);
	}
};

export const resetPassword = async (resetPasswordToken, newPassword) => {
	try {
		const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, TOKEN_TYPES.RESET_PASSWORD);
		const user = await userService.getUserById(resetPasswordTokenDoc.user);
		if (!user) {
			throw new Error();
		}
		await Token.deleteMany({ user: user.id, type: TOKEN_TYPES.RESET_PASSWORD });
		await userService.updateUserById(user.id, { password: newPassword });
	} catch (err) {
		throw new APIError('Password reset failed', 401, true);
	}
};
