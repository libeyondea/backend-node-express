import _ from 'lodash';
import * as userService from '~/services/userService';
import APIError from '~/utils/apiError';

export const createUser = async (req, res) => {
	const user = await userService.createUser(req.body);
	return res.status(201).json({
		success: true,
		data: user
	});
};

export const getUsers = async (req, res) => {
	const filters = _.pick(req.query, ['q']);
	const options = _.pick(req.query, ['limit', 'page', 'sortBy', 'sortDirection']);
	const users = await userService.queryUsers(filters, options);
	return res.json({
		success: true,
		data: users.results,
		pagination: {
			total: users.totalResults
		}
	});
};

export const getUser = async (req, res) => {
	const user = await userService.getUserById(req.params.userId);
	if (!user) {
		throw new APIError('User not found', 404, true);
	}
	return res.json({
		success: true,
		data: user
	});
};

export const updateUser = async (req, res) => {
	const user = await userService.updateUserById(req.params.userId, req.body);
	return res.json({
		success: true,
		data: user
	});
};

export const deleteUser = async (req, res) => {
	const user = await userService.deleteUserById(req.params.userId);
	return res.json({
		success: true,
		data: user
	});
};
