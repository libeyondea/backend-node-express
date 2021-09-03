import mongoose from 'mongoose';
import toJSON from './plugins/toJSONPlugin';

const tokenSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'users',
			required: true
		},
		token: {
			type: String,
			required: true,
			index: true
		},
		type: {
			type: String,
			enum: ['refresh', 'resetPassword', 'verifyEmail'],
			required: true
		},
		expires: {
			type: Date,
			required: true
		},
		blacklisted: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: true
	}
);

tokenSchema.plugin(toJSON);

export default mongoose.model('token', tokenSchema);
