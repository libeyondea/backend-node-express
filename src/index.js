import mongoose from 'mongoose';
import { DATABASE_URI, HOST, PORT } from '~/config/env';
import app from '~/config/express';
import logger from './config/logger';

let server;

const db = mongoose.connection;

db.on('connecting', () => {
	logger.info('🚀 Connecting to MongoDB...');
});

db.on('error', (err) => {
	logger.error(`MongoDB connection error: ${err}`);
	mongoose.disconnect();
});

db.on('connected', () => {
	logger.info('🚀 Connected to MongoDB!');
});

db.once('open', () => {
	logger.info('🚀 MongoDB connection opened!');
});

db.on('reconnected', () => {
	logger.info('🚀 MongoDB reconnected!');
});

mongoose
	.connect(DATABASE_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		logger.info('🚀 Connected to MongoDB end!');
		server = app.listen(PORT, HOST, () => {
			logger.info(`🚀 Host: http://${HOST}:${PORT}`);
			logger.info('██████╗░░░██╗██╗███████╗');
			logger.info('██╔══██╗░██╔╝██║╚════██║');
			logger.info('██║░░██║██╔╝░██║░░███╔═╝');
			logger.info('██║░░██║███████║██╔══╝░░');
			logger.info('██████╔╝╚════██║███████╗');
			logger.info('╚═════╝░░░░░░╚═╝╚══════╝');
		});
	})
	.catch((err) => {
		logger.error(`MongoDB connection error: ${err}`);
	});

const exitHandler = () => {
	if (server) {
		server.close(() => {
			logger.info('Server closed');
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error) => {
	logger.error(error);
	exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
	logger.info('SIGTERM received');
	if (server) {
		server.close();
	}
});
