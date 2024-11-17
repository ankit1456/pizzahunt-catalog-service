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

export interface IQueryParams {
  page: number;
  limit: number;
  q: string;
}

export * from './storage';
