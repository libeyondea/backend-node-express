import jwt from 'jsonwebtoken';
import moment from 'moment';
import { JWT_ACCESS_EXPIRATION_MINUTES, JWT_SECRET_KEY } from '~/config/env';

export const generateToken = (userId, expires, secret = JWT_SECRET_KEY) => {
	const payload = {
		sub: userId,
		iat: moment().unix(),
		exp: expires.unix()
	};
	return jwt.sign(payload, secret);
};

export const generateAuthToken = async (user) => {
	const accessTokenExpires = moment().add(JWT_ACCESS_EXPIRATION_MINUTES, 'minutes');
	const accessToken = generateToken(user.id, accessTokenExpires);
	return {
		access_token: {
			token: accessToken,
			expires: accessTokenExpires.format()
		}
	};
};
