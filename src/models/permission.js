import mongoose from 'mongoose';
import toJSON from './plugins/toJSONPlugin';

const permissionSchema = mongoose.Schema(
	{
		type: {
			type: String,
			required: true
		},
		controller: {
			type: String,
			required: true
		},
		action: {
			type: String,
			required: true
		},
		enabled: {
			type: Boolean,
			default: true
		}
	},
	{
		timestamps: true
	}
);

permissionSchema.plugin(toJSON);

export default mongoose.model('permissions', permissionSchema);
