export const MAX_FILE_SIZE = 500 * 1024;

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

export const API_ROUTE_PREFIX = '/api/catalog';
