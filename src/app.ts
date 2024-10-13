import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import healthRouter from './common/health.router';
import logger from './config/logger';
import { categoryRouter } from './features/category';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json());

app.use('/api', healthRouter);
app.use('/api/categories', categoryRouter);

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message, {
    errorName: err.name
  });
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        message: err.message,
        path: '',
        location: ''
      }
    ]
  });
});

export default app;
