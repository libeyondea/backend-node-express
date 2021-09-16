import passport from 'passport';
import httpStatus from 'http-status';
import APIError from '~/utils/apiError';
import Role from '~/models/roleModel';

const verifyCallback = (req, next, /* resolve, reject, */ requiredRights) => async (err, user, info) => {
	if (err || info || !user) {
		return next(new APIError(httpStatus[httpStatus.UNAUTHORIZED], httpStatus.UNAUTHORIZED));
	}
	req.user = user;
	if (requiredRights.length) {
		const userRights = [];
		const roles = await Role.find({ _id: { $in: user.roles } }).populate('permissions');
		roles.forEach((i) => {
			i.permissions.forEach((j) => {
				userRights.push(`${j.controller}:${j.action}`);
			});
		});
		const hasRequiredRights = requiredRights.every((r) => userRights.includes(r));
		//console.log('requiredRights: ', requiredRights);
		//console.log('userRights: ', userRights);
		//console.log('boolean: ', hasRequiredRights);
		if (!hasRequiredRights) {
			return next(new APIError('Resource access denied', httpStatus.FORBIDDEN));
		}
	}
	return next();
};

const authenticate =
	(...requiredRights) =>
	async (req, res, next) => {
		//		return new Promise((resolve, reject) => {
		return passport.authenticate('jwt', { session: false }, verifyCallback(req, next, /* resolve, reject, */ requiredRights))(
			req,
			res,
			next
		);
	};
//		})
//			.then(() => next())
//			.catch((err) => next(err));

export default authenticate;
