import Joi from 'joi';

export const signup = {
	body: Joi.object().keys({
		firstName: Joi.string().trim().min(2).max(66).required(),
		lastName: Joi.string().trim().min(2).max(66).required(),
		userName: Joi.string().alphanum().min(6).max(66).required(),
		email: Joi.string().required().email(),
		password: Joi.string().trim().min(6).max(666).required()
	})
};

export const signin = {
	body: Joi.object().keys({
		userName: Joi.string().required(),
		password: Joi.string().required()
	})
};

export const logout = {
	body: Joi.object().keys({
		refreshToken: Joi.string().required()
	})
};

export const refreshTokens = {
	body: Joi.object().keys({
		refreshToken: Joi.string().required()
	})
};
