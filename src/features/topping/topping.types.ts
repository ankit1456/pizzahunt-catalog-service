import {
  IGenericBodyRequest,
  IQueryParams,
  IRequestAuthPayload
} from '@common/types';
import { Request } from 'express';

export interface ITopping {
  toppingName: string;
  image: {
    imageId: string;
    url: string;
  };
  price: number;
  tenantId: string;
  isPublished: boolean;
}

export interface ICreateToppingRequest extends IGenericBodyRequest<ITopping> {}
export interface IUpdateToppingRequest extends IGenericBodyRequest<ITopping> {}
export interface IDeleteToppingRequest extends Request {
  auth: IRequestAuthPayload;
}

export interface IToppingQueryParams extends IQueryParams {
  tenantId: string;
  isPublished: boolean;
}
