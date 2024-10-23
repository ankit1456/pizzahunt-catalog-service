import { NextFunction, Request, RequestHandler, Response } from 'express';

const catchAsync = (requestHandler: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next); // .catch(err=>next(err))
  };
};
export default catchAsync;
