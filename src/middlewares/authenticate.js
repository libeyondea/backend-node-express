import passport from 'passport';
import httpStatus from 'http-status';
import APIError from '~/utils/apiError';

/* const authenticate = (req, res, next) => {
	return passport.authenticate(
		'jwt',
		{
			session: false
		},
		(err, user, info) => {
			if (err) {
				return next(err);
			}
			if (!user) {
				throw new APIError(httpStatus[401], 401, true);
			}
			req.user = user;
			next();
		}
	)(req, res, next);
}; */

const verifyCallback = (req, resolve, reject, role) => async (err, user, info) => {
	if (err || info || !user) {
		return reject(new APIError(httpStatus[401], 401, true));
	}
	req.user = user;
	if (role === 'admin') {
		if (user.role !== 'admin' || req.params.user_id === user.id) {
			return reject(new APIError(httpStatus[403], 403, true));
		}
	}
	resolve();
};

const authenticate = (role) => async (req, res, next) => {
	return new Promise((resolve, reject) => {
		passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, role))(req, res, next);
	})
		.then(() => next())
		.catch((err) => next(err));
};

export default authenticate;
