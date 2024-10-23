import { NextFunction, RequestHandler, Response } from 'express';
import { Request } from 'express-jwt';
import { ERoles, IAuthRequest } from '../types';
import { ForbiddenError } from '../utils/errors';

export default function canAccess(...roles: ERoles[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as IAuthRequest).auth.role as ERoles;

    if (!roles.includes(userRole)) return next(new ForbiddenError());

    next();
  };
}
