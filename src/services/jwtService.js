import jwt from 'jsonwebtoken';
import moment from 'moment';
import APIError from '~/utils/apiError';

export const sign = (userId, expires, secret) => {
	try {
		const payload = {
			sub: userId,
			iat: moment().unix(),
			exp: expires.unix()
		};
		return jwt.sign(payload, secret);
	} catch (err) {
		throw new APIError(err.message, 401);
	}
};

export const verify = async (token, secret) => {
	try {
		return jwt.verify(token, secret);
	} catch (err) {
		throw new APIError(err.message, 401);
	}
};
