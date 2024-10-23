import { body } from 'express-validator';
import {
  EATTRIBUTE_NAME,
  EPRICE_TYPE,
  EWIDGET_TYPE,
  ICreateCategoryRequest
} from './category.types';

export default [
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
    .withMessage('price configuration is required'),

  body('priceConfiguration.*.priceType')
    .exists({ checkFalsy: true })
    .withMessage('price type is required')
    .bail()
    .custom((value: EPRICE_TYPE) => isInEnum('price type', value, EPRICE_TYPE)),

  body('priceConfiguration.*.availableOptions').custom((options, { path }) => {
    const key = extractKeyFromPath(path);
    return validateAvailableOptions(options, key);
  }),

  body('attributes')
    .exists({ checkFalsy: true })
    .withMessage('attributes are required')
    .isArray({ min: 1 })
    .withMessage('please provide at least one attribute'),

  body('attributes.*.attributeName')
    .exists({ checkFalsy: true })
    .withMessage('attribute name is required')
    .bail()
    .custom((value: EATTRIBUTE_NAME) =>
      isInEnum('attribute name', value, EATTRIBUTE_NAME)
    ),

  body('attributes.*.widgetType')
    .exists({ checkFalsy: true })
    .withMessage('widget type is required')
    .bail()
    .custom((value: EWIDGET_TYPE) =>
      isInEnum('widget type', value, EWIDGET_TYPE)
    ),

  body('attributes.*.availableOptions').custom((options, { req, path }) => {
    const attribute = getAttributeByPath(req as ICreateCategoryRequest, path);
    return validateAvailableOptions(options, attribute?.attributeName);
  }),

  body('attributes.*.defaultValue').custom(
    (value: string | undefined, { req, path }) => {
      const attribute = getAttributeByPath(req as ICreateCategoryRequest, path);
      if (!value?.trim())
        throw new Error(
          `default value is required for ${attribute?.attributeName}`
        );
      if (
        attribute?.availableOptions?.length &&
        !attribute?.availableOptions?.includes(value)
      )
        throw new Error(
          `default value must be on of the available options of ${attribute?.attributeName}`
        );
      return true;
    }
  )
];

const isInEnum = <E extends Record<string, string>, V extends E[keyof E]>(
  fieldName: string,
  value: V,
  ENUM: E
) => {
  if (!Object.values(ENUM).includes(value)) {
    throw new Error(
      `${fieldName} must be ${Object.values(ENUM).join(
        ' or '
      )}. '${value}' is invalid`
    );
  }
  return true;
};

const validateAvailableOptions = (
  options: unknown,
  key: string | undefined
) => {
  const isAttribute = Object.values(EATTRIBUTE_NAME).includes(
    key as EATTRIBUTE_NAME
  );
  const field = isAttribute ? 'attribute' : '';
  if (!options || !Array.isArray(options)) {
    throw new Error(`available options are required for ${field} ${key}`);
  }
  if (!options.length) {
    throw new Error(
      `please provide at least one available option for ${field} ${key}`
    );
  }
  return true;
};

const extractKeyFromPath = (path: string) => path.split('.')?.[1];

const getAttributeByPath = (req: ICreateCategoryRequest, path: string) => {
  const match = RegExp(/\[(\d+)\]/).exec(path);
  return match ? req.body.attributes[Number(match[1])] : undefined;
};
