import * as userService from './userService';
import * as tokenService from './tokenService';
import httpStatus from 'http-status';
import APIError from '~/utils/apiError';
import Token from '~/models/token';
import User from '~/models/user';
import Role from '~/models/role';
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
	const refreshTokenDoc = await tokenService.verifyToken(refreshToken, TOKEN_TYPES.REFRESH);
	const user = await userService.getUserById(refreshTokenDoc.user);
	if (!user) {
		throw new APIError(httpStatus[401], 401, true);
	}
	await refreshTokenDoc.remove();
	return tokenService.generateAuthTokens(user);
};
