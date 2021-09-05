import { validationResult } from 'express-validator';
import APIError from '~/utils/apiError';

const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const formatErrors = errors.array({ onlyFirstError: true }).map((i) => {
			return {
				message: i.msg,
				location: i.param,
				locationType: i.location
			};
		});
		return next(new APIError(formatErrors, 400, true));
	}
	return next();
};

export default validate;
