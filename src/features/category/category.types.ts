import { EPRICE_TYPE, EWIDGET_TYPE, IGenericBodyRequest } from '@common/types';

export interface ICategory {
  categoryName: string;
  priceConfiguration: IPriceConfiguration;
  attributes: Array<IAttribute>;
}

export interface IPriceConfiguration
  extends Map<
    string,
    {
      priceType: EPRICE_TYPE;
      availableOptions: Array<string>;
    }
  > {}

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
