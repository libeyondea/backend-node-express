import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import paginate from './plugins/paginatePlugin';
import toJSON from './plugins/toJSONPlugin';
import APIError from '~/utils/apiError';
import Role from './role';

const userSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		},
		userName: {
			type: String,
			required: true,
			unique: true
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true,
			private: true
		},
		avatar: {
			type: String,
			default: 'avatar.png'
		},
		confirmed: {
			type: Boolean,
			default: false
		},
		roles: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'roles'
			}
		]
	},
	{
		timestamps: true
	}
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

class UserClass {
	static async isUserNameAlreadyExists(userName, excludeUserId) {
		return !!(await this.findOne({ userName, _id: { $ne: excludeUserId } }));
	}

	static async isEmailAlreadyExists(email, excludeUserId) {
		return !!(await this.findOne({ email, _id: { $ne: excludeUserId } }));
	}

	static async isRoleIdAlreadyExists(roleId, excludeUserId) {
		return !!(await this.findOne({ roles: roleId, _id: { $ne: excludeUserId } }));
	}

	static async getUserById(id) {
		return await this.findById(id);
	}

	static async getUserByIdWithRoles(id) {
		return await this.findById(id).populate({ path: 'roles', select: 'name description createdAt updatedAt' });
	}

	static async getUserByUserName(userName) {
		return await this.findOne({ userName });
	}

	static async getUserByEmail(email) {
		return await this.findOne({ email });
	}

	static async createUser(body) {
		if (await this.isUserNameAlreadyExists(body.userName)) {
			throw new APIError('User name already exists', 400, true);
		}
		if (await this.isEmailAlreadyExists(body.email)) {
			throw new APIError('Email already exists', 400, true);
		}
		if (body.roles) {
			await Promise.all(
				body.roles.map(async (rid) => {
					if (!(await Role.findById(rid))) {
						throw new APIError('Roles not exist', 400, true);
					}
				})
			);
		}
		return await this.create(body);
	}

	static async updateUserById(userId, body) {
		const user = await this.getUserById(userId);
		if (!user) {
			throw new APIError('User not found', 404, true);
		}
		if (await this.isUserNameAlreadyExists(body.userName, userId)) {
			throw new APIError('User name already exists', 400, true);
		}
		if (await this.isEmailAlreadyExists(body.email, userId)) {
			throw new APIError('Email already exists', 400, true);
		}
		if (body.roles) {
			await Promise.all(
				body.roles.map(async (rid) => {
					if (!(await Role.findById(rid))) {
						throw new APIError('Roles not exist', 400, true);
					}
				})
			);
		}
		Object.assign(user, body);
		return await user.save();
	}

	static async deleteUserById(userId) {
		const user = await this.getUserById(userId);
		if (!user) {
			throw new APIError('User not found', 404, true);
		}
		return await user.remove();
	}

	async isPasswordMatch(password) {
		return bcrypt.compareSync(password, this.password);
	}
}

userSchema.loadClass(UserClass);

userSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		const passwordGenSalt = bcrypt.genSaltSync(10);
		this.password = bcrypt.hashSync(this.password, passwordGenSalt);
	}
	next();
});

const User = mongoose.model('users', userSchema);

export default User;
