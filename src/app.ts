import config from 'config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import healthRouter from './common/health.router';
import { globalErrorHandler } from './common/middlewares';
import { NotFoundError } from './common/utils/errors';
import { categoryRouter } from './features/category';

const app = express();

app.use(
  cors({
    origin: [config.get('frontend.whitelistOrigin')],
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json());

app.use('/api', healthRouter);
app.use('/api/categories', categoryRouter);

app.all('*', (req, res, next) =>
  next(new NotFoundError(`Can't find ${req.url} on the server`))
);

app.use(globalErrorHandler);

export default app;
