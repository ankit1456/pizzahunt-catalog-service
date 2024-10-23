import { Request } from 'express';

export interface IGenericBodyRequest<T> extends Request {
  body: T;
}

export interface IAuthCookie {
  accessToken: string;
}

interface IRequestAuthPayload {
  id?: string;
  sub: string;
  role: string;
}

export interface IAuthRequest extends Request {
  auth: IRequestAuthPayload;
}

export const enum EStatus {
  SUCCESS = 'success',
  FAIL = 'fail',
  ERROR = 'error'
}

export const enum ERoles {
  CUSTOMER = 'customer',
  MANAGER = 'manager',
  ADMIN = 'admin'
}
