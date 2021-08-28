import mongoose from 'mongoose';
import { DATABASE_URI } from './env';

const mongooseConnect = () => {
	const connect = () => {
		mongoose.connect(DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });
	};

	connect();

	mongoose.connection
		.on('open', () => {
			console.log('🚀 MongoDB: Connection Succeeded');
		})
		.on('error', (err) => {
			console.error(err);
		})
		.on('disconnected', connect);
};

export default mongooseConnect;
