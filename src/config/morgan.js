import morgan from 'morgan';
import logger from './logger';

const morganHTTP = morgan('combined', {
	stream: { write: (message) => logger.http(message.trim()) }
});

export default morganHTTP;
