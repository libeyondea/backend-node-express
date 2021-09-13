import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import passport from './passport';
import routes from '~/routes/v1';
import * as error from '~/middlewares/error';
import rateLimiter from '~/middlewares/rateLimiter';
import { NODE_ENV } from './env';
import morgan from './morgan';

const app = express();

if (NODE_ENV !== 'test') {
	app.use(morgan);
}

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());
app.use(rateLimiter);
app.use(passport.initialize());
app.use(express.static('public'));
app.use('/api/v1', routes);
app.use(error.converter);
app.use(error.notFound);
app.use(error.handler);

export default app;
