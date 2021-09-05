import passport from 'passport';
import _ from 'lodash';
import httpStatus from 'http-status';
import APIError from '~/utils/apiError';
import Role from '~/models/role';

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
	if (err || info || !user) {
		return reject(new APIError(httpStatus[401], 401, true));
	}
	req.user = user;
	if (requiredRights.length) {
		let userRights = [];
		const roles = await Role.find({ _id: { $in: user.roles } }).populate('permissions');
		roles.forEach((i) => {
			i.permissions.forEach((j) => {
				userRights.push(`${j.action},${j.controller}`);
			});
		});
		const hasRequiredRights = requiredRights.map(String).every((r) => userRights.includes(r));
		console.log('requiredRights: ', requiredRights.map(String));
		console.log('userRights: ', userRights);
		console.log('Boolean: ', hasRequiredRights);
		if (!hasRequiredRights || req.params.userId === user.id) {
			return reject(new APIError('Resource access denied', 403, true));
		}
	}
	resolve();
};

const authenticate =
	(...requiredRights) =>
	async (req, res, next) => {
		return new Promise((resolve, reject) => {
			passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
		})
			.then(() => next())
			.catch((err) => next(err));
	};

export default authenticate;
