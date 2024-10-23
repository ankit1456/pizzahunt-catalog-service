import { IGenericBodyRequest } from '../../common/types';

export interface ICategory {
  categoryName: string;
  priceConfiguration: IPriceConfiguration;
  attributes: Array<IAttribute>;
}

export interface IPriceConfiguration {
  [key: string]: {
    priceType: EPRICE_TYPE;
    availableOptions: Array<string>;
  };
}

export interface IAttribute {
  attributeName: string;
  widgetType: EWIDGET_TYPE;
  defaultValue: string;
  availableOptions: Array<string>;
}

export interface ICreateCategoryRequest
  extends IGenericBodyRequest<ICategory> {}

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
