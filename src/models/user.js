import mongoose, { Schema } from 'mongoose';
import paginate from './plugins/paginatePlugin';
import bcrypt from 'bcryptjs';
import toJSON from './plugins/toJSONPlugin';

const UserSchema = new Schema(
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
			unique: true,
			required: true
		},
		email: {
			type: String,
			unique: true,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		avatar: {
			type: String,
			default: 'avatar.png'
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user'
		}
	},
	{
		timestamps: true
	}
);

UserSchema.plugin(toJSON);
UserSchema.plugin(paginate);

UserSchema.statics.isUserNameAlreadyExists = async function (userName, excludeUserId) {
	return !!(await this.findOne({ userName, _id: { $ne: excludeUserId } }));
};

UserSchema.statics.isEmailAlreadyExists = async function (email, excludeUserId) {
	return !!(await this.findOne({ email, _id: { $ne: excludeUserId } }));
};

UserSchema.methods.isPasswordMatch = async function (password) {
	return bcrypt.compareSync(password, this.password);
};

UserSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		const passwordGenSalt = bcrypt.genSaltSync(10);
		this.password = bcrypt.hashSync(this.password, passwordGenSalt);
	}
	next();
});

export default mongoose.model('users', UserSchema);
