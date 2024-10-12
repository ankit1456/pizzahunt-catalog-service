import express, { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import logger from './config/logger';
import { healthRouter } from './routes';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true
  })
);

app.use(express.json());

app.use('/api', healthRouter);

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
