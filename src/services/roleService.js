import _ from 'lodash';
import Role from '~/models/role';
import Permission from '~/models/permission';
import APIError from '~/utils/apiError';

export const getRoleById = async (id) => {
	return await Role.findById(id);
};

export const getRoleByName = async (name) => {
	return await Role.findOne({ name: name });
};

export const getRoles = async (filters, options) => {
	return await Role.paginate(filters, options, ['name']);
};

export const createRole = async (body) => {
	if (await Role.isNameAlreadyExists(body.name)) {
		throw new APIError('Name already exists', 400, true);
	}
	if (body.permissions && body.permissions.length) {
		let permissions = [];
		await Promise.all(
			body.permissions.map(async (pid) => {
				if (await Permission.findById(pid)) {
					permissions.push(pid);
				}
			})
		);
		body.permissions = permissions;
	}
	return await Role.create(body);
};

export const updateRoleById = async (roleId, body) => {
	const role = await getRoleById(roleId);
	if (!role) {
		throw new APIError('Role not found', 404, true);
	}
	if (await Role.isNameAlreadyExists(body.name, roleId)) {
		throw new APIError('Name already exists', 400, true);
	}
	if (body.permissions && body.permissions.length) {
		let permissions = [];
		await Promise.all(
			body.permissions.map(async (pid) => {
				if (await Permission.findById(pid)) {
					permissions.push(pid);
				}
			})
		);
		body.permissions = permissions;
	}
	Object.assign(role, body);
	return await role.save();
};

export const deleteRoleById = async (roleId) => {
	const role = await getRoleById(roleId);
	if (!role) {
		throw new APIError('Role not found', 404, true);
	}
	return await role.remove();
};
