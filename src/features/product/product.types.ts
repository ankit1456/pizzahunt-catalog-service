import { EPRICE_TYPE } from '@common/constants';
import {
  IGenericBodyRequest,
  IQueryParams,
  IRequestAuthPayload
} from '@common/types';
import { Request } from 'express';
import mongoose from 'mongoose';

export interface IPriceConfiguration
  extends Map<
    string,
    {
      priceType: EPRICE_TYPE;
      availableOptions: Map<string, number>;
    }
  > {}

export interface IAttribute {
  attributeName: string;
  value: mongoose.Schema.Types.Mixed;
}

export interface IProduct {
  productName: string;
  description: string;
  image: { imageId: string; url: string };
  priceConfiguration: IPriceConfiguration;
  attributes: Array<IAttribute>;
  tenantId: string;
  categoryId: mongoose.Types.ObjectId;
  isPublished: boolean;
}

export interface ICreateProductRequest extends IGenericBodyRequest<IProduct> {}

export interface IUpdateProductRequest
  extends IGenericBodyRequest<
    IProduct & {
      removePriceConfigurationOrAttribute?: {
        priceConfigurationKeys?: Array<string>;
        attributeNames?: Array<string>;
      };
    }
  > {}

export interface IDeleteProductRequest extends Request {
  auth: IRequestAuthPayload;
}

export interface IProductQueryParams extends IQueryParams {
  tenantId: string;
  categoryId: string;
  isPublished: boolean;
}
