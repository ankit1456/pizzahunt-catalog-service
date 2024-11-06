import {
  ForbiddenError,
  UnAuthorizedError,
  ValidationError
} from '@common/errors';
import { EStatus } from '@common/types';
import { logger } from '@config';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError as UnauthorizedErrorExpressJwt } from 'express-jwt';
import { ValidationError as TExpressValidationError } from 'express-validator';
import { HttpError } from 'http-errors';
import { MongoServerError } from 'mongodb';
import { v4 as uuid } from 'uuid';

type ErrorResponse = {
  ref: string;
  type: string;
  message: string;
  statusCode: number;
  status: EStatus;
  stack?: string;
  path: string;
  location: string;
  errors?: TExpressValidationError[];
  field?: string;
};

// Error Handler Middleware
export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isProduction = process.env.NODE_ENV === 'production';

  const errorId = uuid();
  let statusCode = 500;

  const response: ErrorResponse = {
    ref: errorId,
    type: err.name,
    message: err.message,
    status: EStatus.FAIL,
    statusCode,
    stack: isProduction ? undefined : err.stack,
    path: req.path,
    location: 'server'
  };

  if (
    err instanceof UnAuthorizedError ||
    err instanceof UnauthorizedErrorExpressJwt
  ) {
    statusCode = err.status;
    if (err instanceof UnauthorizedErrorExpressJwt) {
      response.message = 'You are not logged in. Please log in and try again';
    }
  } else if (err instanceof ValidationError) {
    statusCode = err.statusCode;
    response.errors = err.errors;
  } else if (err instanceof ForbiddenError) {
    response.message = err.message;
  } else if (err instanceof MongoServerError) {
    statusCode = 400;
    if (err.code === 11000) {
      const duplicateFieldAndValue = getDuplicateFieldAndValue(err);

      if (duplicateFieldAndValue) {
        const { field, value } = duplicateFieldAndValue;
        response.message = `${field} (${value}) already exists`;
        response.field = field;
      }
    }
  } else if (err instanceof HttpError) {
    statusCode = err.statusCode;
  } else {
    response.message = 'Something went wrong. Please try again later';
    response.status = EStatus.ERROR;
    response.statusCode = statusCode;
  }

  logger.error(err.message, {
    id: errorId,
    errorName: err.name,
    statusCode,
    error: err.stack,
    path: req.path,
    method: req.method
  });

  return res.status(statusCode).json(response);
}

function getDuplicateFieldAndValue(err: MongoServerError) {
  const match = RegExp(
    /index:\s*(.+?)\s*dup key:\s*{\s*(.+?):\s*"(.+?)"\s*}/
  ).exec(err.errmsg);

  if (match) {
    const [, , field, value] = match;

    return { field, value };
  }
}
