import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import passport from './passport';
import api from '~/routes/api';
import * as error from '~/middlewares/error';

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(compression());

app.use(helmet());

app.use(cors());

app.use(passport.initialize());

app.use('/api/v1', api);

app.use(error.converter);

app.use(error.notFound);

app.use(error.handler);

export default app;
