import Joi from 'joi';
import { mongoId } from './customValidation';

export const createUser = {
	body: Joi.object().keys({
		firstName: Joi.string().trim().min(2).max(66).required(),
		lastName: Joi.string().trim().min(2).max(66).required(),
		userName: Joi.string().alphanum().min(6).max(66).required(),
		email: Joi.string().required().email(),
		password: Joi.string().trim().min(6).max(666).required(),
		roles: Joi.array().items(Joi.string().custom(mongoId)).min(1).max(6).unique().required()
	})
};

export const getUsers = {
	query: Joi.object().keys({
		q: Joi.string(),
		sortBy: Joi.string(),
		sortDirection: Joi.string(),
		limit: Joi.number().integer(),
		page: Joi.number().integer()
	})
};

export const getUser = {
	params: Joi.object().keys({
		userId: Joi.string().custom(mongoId)
	})
};

export const updateUser = {
	params: Joi.object().keys({
		userId: Joi.string().custom(mongoId).required()
	}),
	body: Joi.object().keys({
		firstName: Joi.string().trim().min(2).max(66),
		lastName: Joi.string().trim().min(2).max(66),
		userName: Joi.string().alphanum().min(6).max(66),
		email: Joi.string().email(),
		password: Joi.string().trim().min(6).max(666),
		roles: Joi.array().items(Joi.string().custom(mongoId)).min(1).max(6).unique()
	})
};

export const deleteUser = {
	params: Joi.object().keys({
		userId: Joi.string().custom(mongoId)
	})
};
