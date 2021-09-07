import _ from 'lodash';
import * as userService from '~/services/userService';
import * as roleService from '~/services/roleService';
import APIError from '~/utils/apiError';
import User from '~/models/user';

export const createUser = async (req, res) => {
	const user = await userService.createUser(req.body);
	return res.status(200).json({
		success: true,
		data: user
	});
};

export const getUsers = async (req, res) => {
	const filters = _.pick(req.query, ['q']);
	const options = _.pick(req.query, ['limit', 'page', 'sortBy', 'sortDirection']);
	const users = await userService.getUsers(filters, options);
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
	const role = await roleService.getRoleByName('Super Administrator');
	if (!(await User.isRoleAlreadyExists(role.id, req.params.userId))) {
		throw new APIError('Requires at least 1 user as Super Administrator', 400, true);
	}
	await userService.deleteUserById(req.params.userId);
	return res.json({
		success: true,
		data: {}
	});
};
