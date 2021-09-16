import Permission from '~/models/permissionModel';
import Role from '~/models/roleModel';
import User from '~/models/userModel';
import logger from './logger';

async function initialData() {
	try {
		const countPermissions = await Permission.estimatedDocumentCount();
		console.log(1, countPermissions);
		if (countPermissions === 0) {
			await Permission.create(
				{
					controller: 'user',
					action: 'create'
				},
				{
					controller: 'user',
					action: 'read'
				},
				{
					controller: 'user',
					action: 'update'
				},
				{
					controller: 'user',
					action: 'delete'
				},
				{
					controller: 'role',
					action: 'create'
				},
				{
					controller: 'role',
					action: 'read'
				},
				{
					controller: 'role',
					action: 'update'
				},
				{
					controller: 'role',
					action: 'delete'
				}
			);
		}
		const countRoles = await Role.estimatedDocumentCount();
		console.log(2, countRoles);
		if (countRoles === 0) {
			const permissionsSuperAdministrator = await Permission.find();
			const permissionsAdministrator = await Permission.find({ controller: 'user' });
			const permissionsModerator = await Permission.find({ controller: 'user', action: { $ne: 'delete' } });
			await Role.create(
				{
					name: 'Super Administrator',
					permissions: permissionsSuperAdministrator
				},
				{
					name: 'Administrator',
					permissions: permissionsAdministrator
				},
				{
					name: 'Moderator',
					permissions: permissionsModerator
				},
				{
					name: 'User',
					permissions: []
				}
			);
		}
		const countUsers = await User.estimatedDocumentCount();
		console.log(3, countUsers);
		if (countUsers === 0) {
			const roleSuperAdministrator = await Role.findOne({ name: 'Super Administrator' });
			const roleAdministrator = await Role.findOne({ name: 'Administrator' });
			const roleModerator = await Role.findOne({ name: 'Moderator' });
			const roleUser = await Role.findOne({ name: 'User' });
			await User.create(
				{
					firstName: 'Thuc',
					lastName: 'Nguyen',
					userName: 'superadmin',
					email: 'admjnwapviip@gmail.com',
					password: 'superadmin',
					roles: [roleSuperAdministrator, roleAdministrator, roleModerator, roleUser]
				},
				{
					firstName: 'Vy',
					lastName: 'Nguyen',
					userName: 'admin',
					email: 'admin@example.com',
					password: 'admin',
					roles: [roleAdministrator]
				},
				{
					firstName: 'Thuyen',
					lastName: 'Nguyen',
					userName: 'moderator',
					email: 'moderator@example.com',
					password: 'moderator',
					roles: [roleModerator]
				},
				{
					firstName: 'Uyen',
					lastName: 'Nguyen',
					userName: 'user',
					email: 'user@example.com',
					password: 'user',
					roles: [roleUser]
				}
			);
		}
	} catch (err) {
		logger.error(err);
	}
}

export default initialData;
