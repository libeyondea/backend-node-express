import winston from 'winston';

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		winston.format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`)
	),
	transports: [
		new winston.transports.File({
			level: 'error',
			filename: 'logs/error.log',
			maxsize: '10000000',
			maxFiles: '10'
		}),
		new winston.transports.File({
			filename: 'logs/combined.log',
			maxsize: '10000000',
			maxFiles: '10'
		}),
		new winston.transports.Console()
	]
});

export default logger;
