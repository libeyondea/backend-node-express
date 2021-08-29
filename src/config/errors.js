import { NODE_ENV } from '~/config/env';
import httpStatus from 'http-status';

class ExtendableError extends Error {
	constructor(message, status, isPublic) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.status = status;
		this.isPublic = isPublic;
		this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
		Error.captureStackTrace(this, this.constructor.name);
	}
}

export class APIError extends ExtendableError {
	constructor(message, status = 500, isPublic = false) {
		super(message, status, isPublic);
	}
}

const errors = {
	converter: (err, req, res, next) => {
		if (!(err instanceof APIError)) {
			const apiError = new APIError(err.message, err.status, err.isPublic);
			return next(apiError);
		}
		return next(err);
	},
	notFound: (req, res, next) => {
		return next(new APIError(httpStatus[404], 404));
	},
	handler: (err, req, res, next) => {
		res.status(err.status).json({
			errors: err.isPublic ? err.message : httpStatus[err.status],
			stack: NODE_ENV === 'development' ? err.stack : {}
		});
	}
};

export default errors;
