import mongoose from 'mongoose';
import paginate from './plugins/paginatePlugin';
import bcrypt from 'bcryptjs';
import toJSON from './plugins/toJSONPlugin';

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

userSchema.statics.isUserNameAlreadyExists = async function (userName, excludeUserId) {
	return !!(await this.findOne({ userName, _id: { $ne: excludeUserId } }));
};

userSchema.statics.isEmailAlreadyExists = async function (email, excludeUserId) {
	return !!(await this.findOne({ email, _id: { $ne: excludeUserId } }));
};

userSchema.methods.isPasswordMatch = async function (password) {
	return bcrypt.compareSync(password, this.password);
};

userSchema.statics.isRoleAlreadyExists = async function (role, excludeUserId) {
	return !!(await this.findOne({ roles: role, _id: { $ne: excludeUserId } }));
};

userSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		const passwordGenSalt = bcrypt.genSaltSync(10);
		this.password = bcrypt.hashSync(this.password, passwordGenSalt);
	}
	next();
});

export default mongoose.model('users', userSchema);
