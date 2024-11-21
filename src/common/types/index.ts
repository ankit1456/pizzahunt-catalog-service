import { ERoles } from '@common/constants';
import { Request } from 'express';
import mongoose from 'mongoose';

export interface IAuthCookie {
  accessToken: string;
}

export interface IRequestAuthPayload {
  sub: string;
  role: ERoles;
  id?: string;
  tenantId?: string;
}

export interface IGenericBodyRequest<T> extends Request {
  body: T;
  auth?: IRequestAuthPayload;
}

export interface IAuthRequest extends Request {
  auth: IRequestAuthPayload;
}

export interface IQueryParams {
  page: number;
  limit: number;
  q: string;
}

export interface IFilters {
  tenantId?: string;
  categoryId?: mongoose.Types.ObjectId;
  isPublished?: boolean;
}

export * from './storage';
