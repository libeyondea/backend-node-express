import * as userService from './userService';
import * as tokenService from './tokenService';
import httpStatus from 'http-status';
import APIError from '~/utils/apiError';
import Token from '~/models/token';
import User from '~/models/user';

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
	const user = await User.create({
		firstName: body.firstName,
		lastName: body.lastName,
		userName: body.userName,
		email: body.email,
		password: body.password
	});
	return user;
};

export const logout = async (refreshToken) => {
	const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: 'refresh', blacklisted: false });
	if (!refreshTokenDoc) {
		throw new APIError('Token not found', 400, true);
	}
	await refreshTokenDoc.remove();
};

export const refreshTokens = async (refreshToken) => {
	const refreshTokenDoc = await tokenService.verifyToken(refreshToken, 'refresh');
	const user = await userService.getUserById(refreshTokenDoc.user);
	if (!user) {
		throw new APIError(httpStatus[401], 401, true);
	}
	await refreshTokenDoc.remove();
	return tokenService.generateAuthTokens(user);
};
