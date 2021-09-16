import moment from 'moment';
import config from '~/config/config';
import APIError from '~/utils/apiError';
import User from '~/models/userModel';
import Token from '~/models/tokenModel';
import jwtService from './jwtService';
import httpStatus from 'http-status';
import crypto from 'crypto';

export const generateRandomToken = async (length = 66) => {
	const random = crypto.randomBytes(length).toString('hex');
	return random;
};

export const verifyToken = async (token, type) => {
	const tokenDoc = await Token.findOne({ token, type, blacklisted: false });
	if (!tokenDoc) {
		throw new APIError('Token not found', httpStatus.UNAUTHORIZED);
	}
	if (moment(tokenDoc.expiresAt).format() < moment().format()) {
		throw new APIError('Token expires', httpStatus.UNAUTHORIZED);
	}
	return tokenDoc;
};

export const generateAuthTokens = async (user) => {
	const accessTokenExpires = moment().add(config.JWT_ACCESS_TOKEN_EXPIRATION_MINUTES, 'minutes');
	const accessToken = await jwtService.sign(user.id, accessTokenExpires, config.JWT_ACCESS_TOKEN_SECRET_PRIVATE, {
		algorithm: 'RS256'
	});

	const refreshTokenExpires = moment().add(config.REFRESH_TOKEN_EXPIRATION_DAYS, 'days');
	const refreshToken = await generateRandomToken();
	await Token.saveToken(refreshToken, user.id, refreshTokenExpires.format(), config.TOKEN_TYPES.REFRESH);

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
	const expires = moment().add(config.VERIFY_EMAIL_TOKEN_EXPIRATION_MINUTES, 'minutes');
	const verifyEmailToken = await generateRandomToken();
	await Token.saveToken(verifyEmailToken, user.id, expires, config.TOKEN_TYPES.VERIFY_EMAIL);
	return verifyEmailToken;
};

export const generateResetPasswordToken = async (email) => {
	const user = await User.getUserByEmail(email);
	if (!user) {
		throw new APIError('No users found with this email', httpStatus.NOT_FOUND);
	}
	const expires = moment().add(config.RESET_PASSWORD_TOKEN_EXPIRATION_MINUTES, 'minutes');
	const resetPasswordToken = await generateRandomToken();
	await Token.saveToken(resetPasswordToken, user.id, expires, config.TOKEN_TYPES.RESET_PASSWORD);
	return resetPasswordToken;
};

export default {
	generateRandomToken,
	verifyToken,
	generateAuthTokens,
	generateVerifyEmailToken,
	generateResetPasswordToken
};
