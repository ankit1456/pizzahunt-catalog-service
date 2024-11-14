import { EPRICE_TYPE, IGenericBodyRequest } from '@common/types';
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

export interface ICreateProductRequest extends IGenericBodyRequest<IProduct> {}

// export interface IUpdateCategoryRequest
//   extends IGenericBodyRequest<
//     ICategory & {
//       removePriceConfigurationOrAttribute?: {
//         priceConfiguration?: Array<string>;
//         attributeNames?: Array<string>;
//       };
//     }
//   > {}
