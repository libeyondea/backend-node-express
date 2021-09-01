import mongoose from '~/config/mongoose';
import { HOST, PORT } from '~/config/env';
import app from '~/config/express';
import logger from './config/logger';

app.listen(PORT, HOST, () => {
	logger.info('██████╗░░░██╗██╗███████╗');
	logger.info('██╔══██╗░██╔╝██║╚════██║');
	logger.info('██║░░██║██╔╝░██║░░███╔═╝');
	logger.info('██║░░██║███████║██╔══╝░░');
	logger.info('██████╔╝╚════██║███████╗');
	logger.info('╚═════╝░░░░░░╚═╝╚══════╝');
	logger.info(`🚀 Host: http://${HOST}:${PORT}`);
	mongoose();
});
