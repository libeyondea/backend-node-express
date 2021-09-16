import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import APIError from '~/utils/apiError';

export const sign = async (userId, expires, secret, options) => {
	try {
		const payload = {
			sub: userId,
			iat: moment().unix(),
			exp: expires.unix()
		};
		return jwt.sign(payload, secret, options);
	} catch (err) {
		throw new APIError(err.message, httpStatus.UNAUTHORIZED);
	}
};

export const verify = async (token, secret, options) => {
	try {
		return jwt.verify(token, secret, options);
	} catch (err) {
		throw new APIError(err.message, httpStatus.UNAUTHORIZED);
	}
};

export default { sign, verify };
