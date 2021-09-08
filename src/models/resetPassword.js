import mongoose from 'mongoose';
import toJSON from './plugins/toJSONPlugin';

const resetPasswordSchema = mongoose.Schema(
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
		blacklisted: {
			type: Boolean,
			default: false
		},
		expiresAt: {
			type: Date,
			required: true
		}
	},
	{
		timestamps: true
	}
);

resetPasswordSchema.plugin(toJSON);

export default mongoose.model('resetpassword', resetPasswordSchema);
