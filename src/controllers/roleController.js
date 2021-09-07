import _ from 'lodash';
import * as roleService from '~/services/roleService';
import APIError from '~/utils/apiError';
import User from '~/models/user';

export const createRole = async (req, res) => {
	const role = await roleService.createRole(req.body);
	return res.status(200).json({
		success: true,
		data: role
	});
};

export const getRole = async (req, res) => {
	const role = await roleService.getRoleById(req.params.roleId);
	if (!role) {
		throw new APIError('Role not found', 404, true);
	}
	return res.json({
		success: true,
		data: role
	});
};

export const updateRole = async (req, res) => {
	const role = await roleService.updateRoleById(req.params.roleId, req.body);
	return res.json({
		success: true,
		data: role
	});
};

export const getRoles = async (req, res) => {
	const filters = _.pick(req.query, ['q']);
	const options = _.pick(req.query, ['limit', 'page', 'sortBy', 'sortDirection']);
	const roles = await roleService.getRoles(filters, options);
	return res.json({
		success: true,
		data: roles.results,
		pagination: {
			total: roles.totalResults
		}
	});
};

export const deleteRole = async (req, res) => {
	if (await User.isRoleAlreadyExists(req.params.roleId)) {
		throw new APIError('A role cannot be deleted if associated with users', 400, true);
	}
	await roleService.deleteRoleById(req.params.roleId);
	return res.json({
		success: true,
		data: {}
	});
};
