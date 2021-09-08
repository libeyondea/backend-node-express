import mongoose from 'mongoose';
import toJSON from './plugins/toJSONPlugin';

const refreshTokenSchema = mongoose.Schema(
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

refreshTokenSchema.plugin(toJSON);

export default mongoose.model('refreshtokens', refreshTokenSchema);
