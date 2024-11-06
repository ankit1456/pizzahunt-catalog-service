import { NotFoundError } from '@common/errors';
import healthRouter from '@common/health.router';
import { globalErrorHandler } from '@common/middlewares';
import { categoryRouter } from '@features/category';
import config from 'config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

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
