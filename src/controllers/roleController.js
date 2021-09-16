import _ from 'lodash';
import APIError from '~/utils/apiError';
import User from '~/models/userModel';
import Role from '~/models/roleModel';
import httpStatus from 'http-status';

export const createRole = async (req, res) => {
	const role = await Role.createRole(req.body);
	return res.status(200).json({
		success: true,
		data: role
	});
};

export const getRole = async (req, res) => {
	const role = await Role.getRoleById(req.params.roleId);
	if (!role) {
		throw new APIError('Role not found', httpStatus.NOT_FOUND);
	}
	return res.json({
		success: true,
		data: role
	});
};

export const updateRole = async (req, res) => {
	const role = await Role.updateRoleById(req.params.roleId, req.body);
	return res.json({
		success: true,
		data: role
	});
};

export const getRoles = async (req, res) => {
	const filters = _.pick(req.query, ['q']);
	const options = _.pick(req.query, ['limit', 'page', 'sortBy', 'sortDirection']);
	const roles = await Role.paginate(
		options,
		'permissions',
		filters.q && {
			$or: [
				{
					name: {
						$regex: filters.q,
						$options: 'i'
					}
				},
				{
					description: {
						$regex: filters.q,
						$options: 'i'
					}
				}
			]
		}
	);
	return res.json({
		success: true,
		data: roles.results,
		pagination: {
			total: roles.totalResults
		}
	});
};

export const deleteRole = async (req, res) => {
	if (await User.isRoleIdAlreadyExists(req.params.roleId)) {
		throw new APIError('A role cannot be deleted if associated with users', httpStatus.BAD_REQUEST);
	}
	await Role.deleteRoleById(req.params.roleId);
	return res.json({
		success: true,
		data: {}
	});
};

export default { createRole, getRole, updateRole, getRoles, deleteRole };
