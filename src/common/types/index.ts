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
  q?: string;
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

export enum EWIDGET_TYPE {
  SWITCH = 'switch',
  RADIO = 'radio'
}
export enum EPRICE_TYPE {
  BASE = 'base',
  ADDITIONAL = 'additional'
}

export enum EATTRIBUTE_NAME {
  IS_POPULAR = 'isPopular',
  SPICINESS = 'Spiciness',
  ALCOHOL = 'Alcohol'
}

export * from './storage';
