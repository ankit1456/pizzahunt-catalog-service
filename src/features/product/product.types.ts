import { EPRICE_TYPE, ERoles } from '@common/constants';
import { IGenericBodyRequest } from '@common/types';
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
  image: string;
  priceConfiguration: IPriceConfiguration;
  attributes: Array<IAttribute>;
  tenantId: string;
  categoryId: mongoose.Schema.Types.ObjectId;
  isPublished: boolean;
}

interface IRequestAuthPayload {
  sub: string;
  role: ERoles;
  id?: string;
  tenantId?: string;
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
  > {
  auth: IRequestAuthPayload;
}
