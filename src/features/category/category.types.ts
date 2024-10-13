import { Request } from 'express';

export interface ICategory {
  name: string;
  priceConfiguration: IPriceConfiguration;
  attributes: Array<IAttribute>;
}

export interface IPriceConfiguration {
  [key: string]: {
    priceType: TPriceType;
    availableOptions: Array<string>;
  };
}

export interface IAttribute {
  name: string;
  widgetType: 'switch' | 'radio';
  defaultValue: string;
  availableOptions: Array<string>;
}

export interface ICreateCategoryRequest extends Request {
  body: ICategory;
}

export type TPriceType = 'base' | 'additional';
