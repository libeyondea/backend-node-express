import jwt from 'jsonwebtoken';
import moment from 'moment';
import Token from '~/models/token';
import { JWT_ACCESS_EXPIRATION_MINUTES, JWT_REFRESH_EXPIRATION_DAYS, JWT_SECRET_KEY, TOKEN_TYPES } from '~/config/env';
import APIError from '~/utils/apiError';

export const saveToken = async (token, userId, expires, type, blacklisted = false) => {
	const tokenDoc = await Token.create({
		user: userId,
		token: token,
		expires: expires.format(),
		type: type,
		blacklisted: blacklisted
	});
	return tokenDoc;
};

export const generateToken = (userId, expires, type, secret = JWT_SECRET_KEY) => {
	const payload = {
		sub: userId,
		iat: moment().unix(),
		exp: expires.unix(),
		type: type
	};
	return jwt.sign(payload, secret);
};

export const verify = async (token) => {
	try {
		return jwt.verify(token, JWT_SECRET_KEY);
	} catch (err) {
		throw new APIError(err.message, 401, true);
	}
};

export const verifyToken = async (token, type) => {
	const payload = await verify(token);
	const tokenDoc = await Token.findOne({ token: token, type: type, user: payload.sub, blacklisted: false });
	if (!tokenDoc) {
		throw new APIError('Token not found', 401, true);
	}
	return tokenDoc;
};

export const generateAuthTokens = async (user) => {
	const accessTokenExpires = moment().add(JWT_ACCESS_EXPIRATION_MINUTES, 'minutes');
	const accessToken = generateToken(user.id, accessTokenExpires, TOKEN_TYPES.ACCESS);

	const refreshTokenExpires = moment().add(JWT_REFRESH_EXPIRATION_DAYS, 'days');
	const refreshToken = generateToken(user.id, refreshTokenExpires, TOKEN_TYPES.REFRESH);
	await saveToken(refreshToken, user.id, refreshTokenExpires, TOKEN_TYPES.REFRESH);

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
