import mongoose from 'mongoose';
import toJSON from './plugins/toJSONPlugin';

const permissionSchema = mongoose.Schema(
	{
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

permissionSchema.index({ controller: 1, action: 1 }, { unique: true });

permissionSchema.plugin(toJSON);

const Permission = mongoose.model('permissions', permissionSchema);

export default Permission;
