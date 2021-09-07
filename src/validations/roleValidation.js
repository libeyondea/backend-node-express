import Joi from 'joi';
import { mongoId } from './customValidation';

export const createRole = {
	body: Joi.object().keys({
		name: Joi.string().trim().min(2).max(66).required(),
		description: Joi.string().min(2).max(666).allow(''),
		permissions: Joi.array().items(Joi.string().custom(mongoId)).unique()
	})
};

export const updateRole = {
	params: Joi.object().keys({
		roleId: Joi.string().custom(mongoId).required()
	}),
	body: Joi.object().keys({
		name: Joi.string().trim().min(2).max(66),
		description: Joi.string().min(2).max(666).allow(''),
		permissions: Joi.array().items(Joi.string().custom(mongoId)).unique()
	})
};

export const deleteRole = {
	params: Joi.object().keys({
		roleId: Joi.string().custom(mongoId)
	})
};

export const getRoles = {
	query: Joi.object().keys({
		q: Joi.string(),
		sortBy: Joi.string(),
		sortDirection: Joi.string(),
		limit: Joi.number().integer(),
		page: Joi.number().integer()
	})
};

export const getRole = {
	params: Joi.object().keys({
		roleId: Joi.string().custom(mongoId)
	})
};
