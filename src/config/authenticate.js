import passport from 'passport';
import { APIError } from './errors';
import httpStatus from 'http-status';

const authenticate = (req, res, next) => {
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
};

export default authenticate;
