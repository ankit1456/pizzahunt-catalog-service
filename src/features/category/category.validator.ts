import { EATTRIBUTE_NAME, EPRICE_TYPE, EWIDGET_TYPE } from '@common/constants';
import { formatEnumMessage } from '@common/utils';
import {
  IAttribute,
  ICreateCategoryRequest
} from '@features/category/category.types';
import { body } from 'express-validator';

export const createCategoryValidator = [
  body('categoryName')
    .trim()
    .notEmpty()
    .withMessage('category name is required')
    .bail()
    .custom((value) => {
      if (!isNaN(value as number))
        throw new Error('please provide a valid category name');
      return true;
    })
    .bail()
    .isLength({ min: 3 })
    .withMessage('category name is too short'),

  body('priceConfiguration')
    .exists()
    .withMessage('price configuration is required')
    .isObject()
    .withMessage('please provice a valid price configuration'),

  body('priceConfiguration.*.priceType')
    .exists({ checkFalsy: true })
    .withMessage('price type is required')
    .bail()
    .custom((value: EPRICE_TYPE) => isInEnum('price type', value, EPRICE_TYPE)),

  body('priceConfiguration.*.availableOptions')
    .custom((options, { path }) => {
      const key = extractKeyFromPath(path);
      return validateAvailableOptions(options, key);
    })
    .customSanitizer((options: string[]) => options.filter((o) => !!o)),

  body('attributes')
    .exists({ checkFalsy: true })
    .withMessage('attributes are required')
    .bail()
    .isArray()
    .withMessage('attributes must be a list of attributes')
    .bail()
    .custom((attributes: IAttribute[]) => attributes.filter((o) => !!o).length)
    .withMessage('please provide at least one attribute'),

  body('attributes.*.attributeName')
    .if((_, { req }) => attributesExists(req as ICreateCategoryRequest))
    .exists({ checkFalsy: true })
    .withMessage('attribute name is required')
    .bail()
    .custom((value: EATTRIBUTE_NAME) =>
      isInEnum('attribute name', value, EATTRIBUTE_NAME)
    ),

  body('attributes.*.widgetType')
    .if((_, { req }) => attributesExists(req as ICreateCategoryRequest))
    .exists({ checkFalsy: true })
    .withMessage((value, { req, path }) => {
      const attribute = getAttributeByPath(req as ICreateCategoryRequest, path);

      return `widget type is required for attribute ${
        attribute?.attributeName ?? ''
      }`;
    })
    .bail()
    .custom((value: EWIDGET_TYPE) =>
      isInEnum('widget type', value, EWIDGET_TYPE)
    ),

  body('attributes.*.availableOptions')
    .if((_, { req }) => attributesExists(req as ICreateCategoryRequest))
    .custom((options, { req, path }) => {
      const attribute = getAttributeByPath(req as ICreateCategoryRequest, path);
      return validateAvailableOptions(options, attribute?.attributeName);
    })
    .customSanitizer((options: string[]) => options.filter((o) => !!o)),

  body('attributes.*.defaultValue').custom(
    (value: string | undefined, { req, path }) =>
      validateAttributeDefaultValue(value, {
        req: req as ICreateCategoryRequest,
        path
      })
  )
];

export const updateCategoryValidator = [
  body('categoryName')
    .optional()
    .trim()
    .custom((value) => {
      if (!value || !isNaN(value))
        throw new Error('please provide a valid category name');
      return true;
    })
    .bail()
    .isLength({ min: 3 })
    .withMessage('category name is too short'),

  body('priceConfiguration')
    .optional()
    .isObject()
    .withMessage('please provide a valid price configuration'),

  body('priceConfiguration.*.priceType')
    .exists({ checkFalsy: true })
    .withMessage('price type is required')
    .bail()
    .custom((value: EPRICE_TYPE) => isInEnum('price type', value, EPRICE_TYPE)),

  body('priceConfiguration.*.availableOptions')
    .custom((options, { path }) => {
      const key = extractKeyFromPath(path);
      return validateAvailableOptions(options, key);
    })
    .customSanitizer((options: string[]) => options.filter((o) => !!o)),

  body('attributes')
    .optional()
    .isArray()
    .withMessage('attributes must be a list'),

  body('attributes.*.attributeName')
    .if((_, { req }) => attributesExists(req as ICreateCategoryRequest))
    .exists({ checkFalsy: true })
    .withMessage('attribute name is required')
    .bail()
    .custom((value: EATTRIBUTE_NAME) =>
      isInEnum('attribute name', value, EATTRIBUTE_NAME)
    ),

  body('attributes.*.widgetType')
    .if((_, { req }) => attributesExists(req as ICreateCategoryRequest))
    .exists({ checkFalsy: true })
    .withMessage((value, { req, path }) => {
      const attribute = getAttributeByPath(req as ICreateCategoryRequest, path);

      return `widget type is required for attribute ${
        attribute?.attributeName ?? ''
      }`;
    })
    .bail()
    .custom((value: EWIDGET_TYPE) =>
      isInEnum('widget type', value, EWIDGET_TYPE)
    ),

  body('attributes.*.availableOptions')
    .if((_, { req }) => attributesExists(req as ICreateCategoryRequest))
    .custom((options, { req, path }) => {
      const attribute = getAttributeByPath(req as ICreateCategoryRequest, path);
      return validateAvailableOptions(options, attribute?.attributeName);
    })
    .customSanitizer((options: string[]) => options.filter((o) => !!o)),

  body('attributes.*.defaultValue').custom(
    (value: string | undefined, { req, path }) =>
      validateAttributeDefaultValue(value, {
        req: req as ICreateCategoryRequest,
        path
      })
  ),

  body('removePriceConfigurationOrAttribute.priceConfigurationKeys')
    .optional()
    .isArray()
    .withMessage('please provide a list price configuration keys to be deleted')
    .bail()
    .custom((configKeys: unknown[]) =>
      configKeys.every((key) => typeof key === 'string')
    )
    .withMessage('price configuration key must be a string'),

  body('removePriceConfigurationOrAttribute.attributeNames')
    .optional()
    .isArray()
    .withMessage('please provide a list of attribute names to be deleted')
    .bail()
    .custom((attributeNames: unknown[]) =>
      attributeNames.every((name) => typeof name === 'string')
    )
    .withMessage('attribute name must be a string')
];

const isInEnum = <E extends Record<string, string>, V extends E[keyof E]>(
  fieldName: string,
  value: V,
  ENUM: E
) => {
  if (!Object.values(ENUM).includes(value)) {
    throw new Error(
      `${fieldName} must be ${formatEnumMessage(Object.values(ENUM))}`
    );
  }
  return true;
};

const validateAvailableOptions = (options: unknown, key = '') => {
  const isAttribute = Object.values(EATTRIBUTE_NAME).includes(
    key as EATTRIBUTE_NAME
  );

  const field = isAttribute ? 'attribute ' : '';

  if (!options)
    throw new Error(
      `available options are required${
        field || key ? ' for ' : ''
      }${field}${key}`
    );

  if (!Array.isArray(options))
    throw new Error(`available options must be a list of options`);

  if (!options.filter((o) => !!o).length) {
    throw new Error(
      `please provide at least one available option for ${field}${key}`
    );
  }
  return true;
};

const attributesExists = (req: ICreateCategoryRequest) =>
  req.body.attributes?.filter((o) => !!o).length > 0;

const extractKeyFromPath = (path: string) => path.split('.')?.[1];

const getAttributeByPath = (req: ICreateCategoryRequest, path: string) => {
  const match = RegExp(/\[(\d+)\]/).exec(path);
  return match ? req.body.attributes[Number(match[1])] : undefined;
};

const validateAttributeDefaultValue = (
  value: string | undefined,
  { req, path }: { req: ICreateCategoryRequest; path: string }
) => {
  if (
    req.body.attributes.some(
      (attribute) => !attribute.availableOptions?.filter((o) => !!o).length
    )
  )
    return true;
  const attribute = getAttributeByPath(req, path);
  if (!value?.trim())
    throw new Error(
      `default value is required for ${attribute?.attributeName}`
    );
  if (
    attribute?.availableOptions?.length &&
    !attribute?.availableOptions?.includes(value)
  )
    throw new Error(
      `default value must be one of the available options of ${attribute?.attributeName}`
    );
  return true;
};
