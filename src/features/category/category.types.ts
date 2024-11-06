import { IGenericBodyRequest } from '@common/types';

export interface ICategory {
  categoryName: string;
  priceConfiguration: TPriceConfiguration;
  attributes: Array<IAttribute>;
}

export type TPriceConfiguration = Map<
  string,
  {
    priceType: EPRICE_TYPE;
    availableOptions: Array<string>;
  }
>;

export interface IAttribute {
  attributeName: string;
  widgetType: EWIDGET_TYPE;
  defaultValue: string;
  availableOptions: Array<string>;
}

export interface ICreateCategoryRequest
  extends IGenericBodyRequest<ICategory> {}
export interface IUpdateCategoryRequest
  extends IGenericBodyRequest<
    ICategory & {
      removePriceConfigurationOrAttribute?: {
        priceConfiguration?: Array<string>;
        attributeNames?: Array<string>;
      };
    }
  > {}

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
  SPICINESS = 'Spiciness'
}
