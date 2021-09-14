import rateLimit from 'express-rate-limit';
import httpStatus from 'http-status';
import APIError from '~/utils/apiError';

const rateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100,
	handler: (req, res, next) => {
		next(new APIError('Too many requests, please try again later.', httpStatus.TOO_MANY_REQUESTS));
	}
});

export default rateLimiter;
