import Permission from '~/models/permission';
import Role from '~/models/role';
import User from '~/models/user';
import * as authService from '~/services/authService';
import * as tokenService from '~/services/tokenService';
import * as emailService from '~/services/emailService';

export const signup = async (req, res) => {
	const user = await authService.signup(req.body);
	const tokens = await tokenService.generateAuthTokens(user);
	return res.json({
		success: true,
		data: { user, tokens }
	});
};

export const signin = async (req, res) => {
	const { userName, password } = req.body;
	const user = await authService.signinWithUserNameAndPassword(userName, password);
	const tokens = await tokenService.generateAuthTokens(user);
	return res.json({
		success: true,
		data: { user, tokens }
	});
};

export const me = async (req, res) => {
	return res.json({
		success: true,
		data: {
			id: req.user.id,
			firstName: req.user.firstName,
			lastName: req.user.lastName,
			userName: req.user.userName,
			email: req.user.email,
			avatar: req.user.avatar,
			role: req.user.role
		}
	});
};

export const logout = async (req, res) => {
	await authService.logout(req.body.refreshToken);
	return res.json({
		success: true,
		data: {}
	});
};

export const refreshTokens = async (req, res) => {
	const tokens = await authService.refreshTokens(req.body.refreshToken);
	return res.json({
		success: true,
		data: {
			tokens
		}
	});
};

export const sendVerificationEmail = async (req, res) => {
	//const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user.id);
	await emailService.sendVerificationEmail(req.user.email, 'THUCDAIK');
	return res.json({
		success: true,
		data: {}
	});
};

export const verifyEmail = async (req, res) => {
	await authService.verifyEmail(req.query.token);
	return res.json({
		success: true,
		data: {}
	});
};

export const setup = async (req, res) => {
	const permissionUserCreate = await Permission.create({
		controller: 'user',
		action: 'create'
	});
	const permissionUserRead = await Permission.create({
		controller: 'user',
		action: 'read'
	});
	const permissionUserUpdate = await Permission.create({
		controller: 'user',
		action: 'update'
	});
	const permissionUserDelete = await Permission.create({
		controller: 'user',
		action: 'delete'
	});

	const permissionRoleCreate = await Permission.create({
		controller: 'role',
		action: 'create'
	});
	const permissionRoleRead = await Permission.create({
		controller: 'role',
		action: 'read'
	});
	const permissionRoleUpdate = await Permission.create({
		controller: 'role',
		action: 'update'
	});
	const permissionRoleDelete = await Permission.create({
		controller: 'role',
		action: 'delete'
	});

	const roleSuperAdministrator = await Role.create({
		name: 'Super Administrator',
		permissions: [
			permissionUserCreate.id,
			permissionUserRead.id,
			permissionUserUpdate.id,
			permissionUserDelete.id,
			permissionRoleCreate.id,
			permissionRoleRead.id,
			permissionRoleUpdate.id,
			permissionRoleDelete.id
		]
	});
	const roleAdministrator = await Role.create({
		name: 'Administrator',
		permissions: [permissionUserCreate.id, permissionUserRead.id, permissionUserUpdate.id, permissionUserDelete.id]
	});
	const roleModerator = await Role.create({
		name: 'Moderator',
		permissions: [permissionUserCreate.id, permissionUserRead.id, permissionUserUpdate.id]
	});
	const roleUser = await Role.create({
		name: 'User',
		permissions: []
	});

	await User.create({
		firstName: 'Thuc',
		lastName: 'Nguyen',
		userName: 'superadmin',
		email: 'superadmin@example.com',
		password: 'superadmin',
		roles: [roleSuperAdministrator.id, roleAdministrator.id, roleModerator.id]
	});
	await User.create({
		firstName: 'Vy',
		lastName: 'Nguyen',
		userName: 'admin',
		email: 'admin@example.com',
		password: 'admin',
		roles: [roleAdministrator.id]
	});
	await User.create({
		firstName: 'Thuyen',
		lastName: 'Nguyen',
		userName: 'moderator',
		email: 'moderator@example.com',
		password: 'moderator',
		roles: [roleModerator.id]
	});
	await User.create({
		firstName: 'Uyen',
		lastName: 'Nguyen',
		userName: 'user',
		email: 'user@example.com',
		password: 'user',
		roles: [roleUser.id]
	});

	return res.json({
		success: true,
		data: 'Setup succes'
	});
};
