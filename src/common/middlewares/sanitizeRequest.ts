import { ValidationError } from '@common/errors';
import { NextFunction, Request, Response } from 'express';
import { validationResult, matchedData } from 'express-validator';

const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);

  if (!result.isEmpty()) return next(new ValidationError(result.array()));

  req.body = matchedData<object>(req);

  next();
};

export default sanitizeRequest;
