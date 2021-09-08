import jwt from 'jsonwebtoken';
import moment from 'moment';
import RefreshToken from '~/models/refreshToken';
import {
	JWT_ACCESS_TOKEN_EXPIRATION_MINUTES,
	JWT_REFRESH_TOKEN_EXPIRATION_DAYS,
	JWT_REFRESH_TOKEN_SECRET,
	JWT_ACCESS_TOKEN_SECRET,
	JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
	JWT_VERIFY_EMAIL_SECRET
} from '~/config/env';
import APIError from '~/utils/apiError';
import VerifyEmail from '~/models/verifyEmail';

export const saveRefreshToken = async (token, userId, expires, blacklisted = false) => {
	const tokenDoc = await RefreshToken.create({
		user: userId,
		token: token,
		expiresAt: expires.format(),
		blacklisted: blacklisted
	});
	return tokenDoc;
};

export const saveVerifyEmailToken = async (token, userId, expires, blacklisted = false) => {
	const tokenDoc = await VerifyEmail.create({
		user: userId,
		token: token,
		expiresAt: expires.format(),
		blacklisted: blacklisted
	});
	return tokenDoc;
};

export const generateToken = (userId, expires, secret) => {
	const payload = {
		sub: userId,
		iat: moment().unix(),
		exp: expires.unix()
	};
	return jwt.sign(payload, secret);
};

export const verify = async (token, secret) => {
	try {
		return jwt.verify(token, secret);
	} catch (err) {
		throw new APIError(err.message, 401, true);
	}
};

export const verifyRefreshToken = async (token) => {
	const payload = await verify(token, JWT_REFRESH_TOKEN_SECRET);
	const tokenDoc = await RefreshToken.findOne({ token: token, user: payload.sub, blacklisted: false });
	if (!tokenDoc) {
		throw new APIError('Token not found', 401, true);
	}
	return tokenDoc;
};

export const verifyEmailToken = async (token) => {
	const payload = await verify(token, JWT_VERIFY_EMAIL_SECRET);
	const tokenDoc = await VerifyEmail.findOne({ token: token, user: payload.sub, blacklisted: false });
	if (!tokenDoc) {
		throw new APIError('Token not found', 401, true);
	}
	return tokenDoc;
};

export const generateAuthTokens = async (user) => {
	const accessTokenExpires = moment().add(JWT_ACCESS_TOKEN_EXPIRATION_MINUTES, 'minutes');
	const accessToken = generateToken(user.id, accessTokenExpires, JWT_ACCESS_TOKEN_SECRET);

	const refreshTokenExpires = moment().add(JWT_REFRESH_TOKEN_EXPIRATION_DAYS, 'days');
	const refreshToken = generateToken(user.id, refreshTokenExpires, JWT_REFRESH_TOKEN_SECRET);
	await saveRefreshToken(refreshToken, user.id, refreshTokenExpires);

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
	const verifyEmailToken = generateToken(user.id, expires, JWT_VERIFY_EMAIL_SECRET);
	await saveVerifyEmailToken(verifyEmailToken, user.id, expires);
	return verifyEmailToken;
};
