import Joi from 'joi';
import _ from 'lodash';
import APIError from '~/utils/apiError';

const validate = (schema) => (req, res, next) => {
	const validSchema = _.pick(schema, ['params', 'query', 'body']);
	const object = _.pick(req, Object.keys(validSchema));
	const { error, value } = Joi.compile(validSchema)
		.prefs({ errors: { label: 'path', wrap: { label: false } }, abortEarly: false })
		.validate(object);
	if (error) {
		const errorMessage = error.details.map((d) => {
			return {
				message: d.message,
				location: d.path[1],
				locationType: d.path[0]
			};
		});
		return next(new APIError(errorMessage, 400));
	}
	Object.assign(req, value);
	return next();
};

export default validate;
