import moment from 'moment';
import {
	JWT_ACCESS_TOKEN_EXPIRATION_MINUTES,
	JWT_REFRESH_TOKEN_EXPIRATION_DAYS,
	JWT_REFRESH_TOKEN_SECRET,
	JWT_ACCESS_TOKEN_SECRET,
	JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
	JWT_VERIFY_EMAIL_SECRET,
	JWT_RESET_PASSWORD_SECRET,
	JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
	TOKEN_TYPES
} from '~/config/env';
import APIError from '~/utils/apiError';
import User from '~/models/userModel';
import Token from '~/models/tokenModel';
import * as jwtService from './jwtService';

export const verifyToken = async (token, type) => {
	let secret = '';
	if (type === TOKEN_TYPES.REFRESH) {
		secret = JWT_REFRESH_TOKEN_SECRET;
	} else if (type === TOKEN_TYPES.VERIFY_EMAIL) {
		secret = JWT_VERIFY_EMAIL_SECRET;
	} else if (type === TOKEN_TYPES.RESET_PASSWORD) {
		secret = JWT_RESET_PASSWORD_SECRET;
	}
	const payload = await jwtService.verify(token, secret);
	const tokenDoc = await Token.findOne({ user: payload.sub, token, type, blacklisted: false });
	if (!tokenDoc) {
		throw new APIError('Token not found', 401, true);
	}
	return tokenDoc;
};

export const generateAuthTokens = async (user) => {
	const accessTokenExpires = moment().add(JWT_ACCESS_TOKEN_EXPIRATION_MINUTES, 'minutes');
	const accessToken = jwtService.sign(user.id, accessTokenExpires, JWT_ACCESS_TOKEN_SECRET);

	const refreshTokenExpires = moment().add(JWT_REFRESH_TOKEN_EXPIRATION_DAYS, 'days');
	const refreshToken = jwtService.sign(user.id, refreshTokenExpires, JWT_REFRESH_TOKEN_SECRET);
	await Token.saveToken(refreshToken, user.id, refreshTokenExpires, TOKEN_TYPES.REFRESH);
	return {
		accessToken: {
			token: accessToken,
			expires: accessTokenExpires.format()
		},
		refreshToken: {
			token: refreshToken,
			expires: refreshTokenExpires.format()
		}
	};
};

export const generateVerifyEmailToken = async (user) => {
	const expires = moment().add(JWT_VERIFY_EMAIL_EXPIRATION_MINUTES, 'minutes');
	const verifyEmailToken = jwtService.sign(user.id, expires, JWT_VERIFY_EMAIL_SECRET);
	await Token.saveToken(verifyEmailToken, user.id, expires, TOKEN_TYPES.VERIFY_EMAIL);
	return verifyEmailToken;
};

export const generateResetPasswordToken = async (email) => {
	const user = await User.getUserByEmail(email);
	if (!user) {
		throw new APIError('No users found with this email', 404);
	}
	const expires = moment().add(JWT_RESET_PASSWORD_EXPIRATION_MINUTES, 'minutes');
	const resetPasswordToken = jwtService.sign(user.id, expires, JWT_RESET_PASSWORD_SECRET);
	await Token.saveToken(resetPasswordToken, user.id, expires, TOKEN_TYPES.RESET_PASSWORD);
	return resetPasswordToken;
};
