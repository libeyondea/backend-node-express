import _ from 'lodash';
import APIError from '~/utils/apiError';
import User from '~/models/user';
import Role from '~/models/role';

export const createUser = async (req, res) => {
	const user = await User.createUser(req.body);
	return res.status(200).json({
		success: true,
		data: user
	});
};

export const getUsers = async (req, res) => {
	const filters = _.pick(req.query, ['q']);
	const options = _.pick(req.query, ['limit', 'page', 'sortBy', 'sortDirection']);
	const users = await User.paginate(filters, options, ['firstName', 'lastName', 'userName']);
	return res.json({
		success: true,
		data: users.results,
		pagination: {
			total: users.totalResults
		}
	});
};

export const getUser = async (req, res) => {
	const user = await User.getUserById(req.params.userId, 'roles');
	if (!user) {
		throw new APIError('User not found', 404, true);
	}
	return res.json({
		success: true,
		data: user
	});
};

export const updateUser = async (req, res) => {
	const role = await Role.getRoleByName('Super Administrator');
	if (req.body.roles && !(await User.isRoleIdAlreadyExists(role.id, req.params.userId)) && !req.body.roles.includes(role.id)) {
		throw new APIError('Requires at least 1 user as Super Administrator', 400, true);
	}
	const user = await User.updateUserById(req.params.userId, req.body);
	return res.json({
		success: true,
		data: user
	});
};

export const deleteUser = async (req, res) => {
	const role = await Role.getRoleByName('Super Administrator');
	if (!(await User.isRoleIdAlreadyExists(role.id, req.params.userId))) {
		throw new APIError('Requires at least 1 user as Super Administrator', 400, true);
	}
	await User.deleteUserById(req.params.userId);
	return res.json({
		success: true,
		data: {}
	});
};
