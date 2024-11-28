import { EATTRIBUTE_NAME, EPRICE_TYPE, MAX_FILE_SIZE } from '@common/constants';
import { formatEnumMessage } from '@common/utils';
import { IAttribute, ICreateProductRequest } from '@features/product';
import { body } from 'express-validator';

export const createProductValidator = [
  body('productName')
    .trim()
    .notEmpty()
    .withMessage('product name is required')
    .bail()
    .custom((value) => {
      if (!isNaN(value)) throw new Error('please provide a valid product name');
      return true;
    })
    .bail()
    .isLength({ min: 3 })
    .withMessage('product name is too short'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('product description is required')
    .bail()
    .custom((value) => {
      if (!isNaN(value))
        throw new Error('please provide a valid product description');
      return true;
    })
    .bail()
    .isLength({ min: 10, max: 50 })
    .withMessage('product description must contain 10 to 50 characters'),

  body('image').custom((value, { req }) => {
    if (!req.files || !req.files.image)
      throw new Error('product image is required');

    const image = req.files?.image;

    if (image?.size > MAX_FILE_SIZE)
      throw new Error('product image must be less than 500kb');

    return true;
  }),

  body('priceConfiguration')
    .exists()
    .withMessage('price configuration is required')
    .custom((priceConfiguration) => {
      if (typeof priceConfiguration === 'string') {
        if (
          !isValidJSON(priceConfiguration) ||
          !Object.keys(JSON.parse(priceConfiguration))?.length
        )
          throw new Error('please provide a valid price configuration');
      }

      if (!Object.keys(priceConfiguration)?.length)
        throw new Error('please provide a valid price configuration');

      return true;
    })
    .bail()
    .customSanitizer((priceConfiguration) => {
      if (typeof priceConfiguration === 'string') {
        const priceMap = new Map<
          string,
          { priceType: EPRICE_TYPE; availableOptions: Map<string, number> }
        >();
        const parsedConfiguration = JSON.parse(priceConfiguration);

        for (const key in parsedConfiguration) {
          const { priceType, availableOptions } = parsedConfiguration[key];

          if (!priceType || !availableOptions) continue;
          const optionsMap = new Map<string, number>(
            Object.entries(availableOptions)
          );
          priceMap.set(key, { priceType, availableOptions: optionsMap });
        }

        return parsedConfiguration;
      }

      return priceConfiguration;
    }),

  body('priceConfiguration.*.priceType')
    .exists({ checkFalsy: true })
    .withMessage('price type is required')
    .bail()
    .custom((value: EPRICE_TYPE) => isInEnum('price type', value, EPRICE_TYPE)),

  body('priceConfiguration.*.availableOptions')
    .exists({ checkFalsy: true })
    .withMessage('available options are required')
    .bail()
    .custom((options) => {
      if (!options || !Object.keys(options).length)
        throw new Error('available options are required');

      return true;
    }),

  body('attributes')
    .exists({ checkFalsy: true })
    .withMessage('attributes are required')
    .bail()
    .custom((attributes: string | IAttribute[]) => {
      if (typeof attributes === 'string') {
        if (!isValidJSON(attributes))
          throw new Error('attributes must be a non-empty list of attributes');

        const parsedAttributes = JSON.parse(attributes);

        if (!Array.isArray(parsedAttributes))
          throw new Error('attributes must be a non-empty list of attributes');

        if (!parsedAttributes.length)
          throw new Error('attributes are required');
      }

      if (!attributes.length) throw new Error('attributes are required');

      return true;
    })
    .bail()
    .customSanitizer((attributes) => {
      if (typeof attributes === 'string') return JSON.parse(attributes);

      return attributes;
    }),

  body('attributes.*.attributeName')
    .if((_, { req }) => attributesExists(req as ICreateProductRequest))
    .exists({ checkFalsy: true })
    .withMessage('attribute name is required')
    .bail()
    .custom((value: EATTRIBUTE_NAME) =>
      isInEnum('attribute name', value, EATTRIBUTE_NAME)
    ),

  body('attributes.*.value').if((_, { req }) =>
    attributesExists(req as ICreateProductRequest)
  ),
  //TODO: value can be true or false add validation
  // .exists({ checkFalsy: true })
  // .withMessage('attribute value is required'),
  body('tenantId')
    .exists({ checkFalsy: true })
    .withMessage('tenant id is required')
    .bail()
    .isUUID()
    .withMessage('please provide a valid tenant id'),

  body('categoryId')
    .exists({ checkFalsy: true })
    .withMessage('category id is required')
    .bail()
    .isMongoId()
    .withMessage('please provide a valid category id'),
  body('isPublished').customSanitizer((isPublished) => {
    return typeof isPublished === 'string' && isPublished === 'true'
      ? true
      : false;
  })
];

export const updateProductValidator = [
  body('productName')
    .optional()
    .trim()
    .custom((value) => {
      if (!value || !isNaN(value))
        throw new Error('please provide a valid product name');
      return true;
    })
    .bail()
    .isLength({ min: 3 })
    .withMessage('product name is too short'),

  body('description')
    .optional()
    .trim()
    .custom((value) => {
      if (!value || !isNaN(value))
        throw new Error('please provide a valid product description');
      return true;
    })
    .bail()
    .isLength({ min: 10, max: 50 })
    .withMessage('product description must contain 10 to 50 characters'),

  body('image').custom((value, { req }) => {
    const image = req.files?.image;

    if (image?.size > MAX_FILE_SIZE)
      throw new Error('product image must be less than 500kb');

    return true;
  }),

  body('priceConfiguration')
    .optional()
    .custom((priceConfiguration) => {
      if (typeof priceConfiguration === 'string') {
        if (
          !isValidJSON(priceConfiguration) ||
          !Object.keys(JSON.parse(priceConfiguration))?.length
        )
          throw new Error('please provide a valid price configuration');
      }

      if (!Object.keys(priceConfiguration)?.length)
        throw new Error('please provide a valid price configuration');

      return true;
    })
    .bail()
    .customSanitizer((priceConfiguration) => {
      if (typeof priceConfiguration === 'string') {
        const priceMap = new Map<
          string,
          { priceType: EPRICE_TYPE; availableOptions: Map<string, number> }
        >();
        const parsedConfiguration = JSON.parse(priceConfiguration);

        for (const key in parsedConfiguration) {
          const { priceType, availableOptions } = parsedConfiguration[key];

          if (!priceType || !availableOptions) continue;
          const optionsMap = new Map<string, number>(
            Object.entries(availableOptions)
          );
          priceMap.set(key, { priceType, availableOptions: optionsMap });
        }

        return parsedConfiguration;
      }

      return priceConfiguration;
    }),

  body('priceConfiguration.*.priceType')
    .exists({ checkFalsy: true })
    .withMessage('price type is required')
    .bail()
    .custom((value: EPRICE_TYPE) => isInEnum('price type', value, EPRICE_TYPE)),

  body('priceConfiguration.*.availableOptions')
    .exists({ checkFalsy: true })
    .withMessage('available options are required')
    .bail()
    .custom((options) => {
      if (!options || !Object.keys(options).length)
        throw new Error('available options are required');

      return true;
    }),

  body('attributes')
    .optional()
    .custom((attributes: string | IAttribute[]) => {
      if (typeof attributes === 'string') {
        if (!isValidJSON(attributes))
          throw new Error('please provide valid attributes list');

        const parsedAttributes = JSON.parse(attributes);

        if (!Array.isArray(parsedAttributes))
          throw new Error('please provide valid attributes list');
      }

      return true;
    })
    .bail()
    .customSanitizer((attributes) => {
      if (typeof attributes === 'string') return JSON.parse(attributes);

      return attributes;
    }),

  body('attributes.*.attributeName')
    .if((_, { req }) => attributesExists(req as ICreateProductRequest))
    .exists({ checkFalsy: true })
    .withMessage('attribute name is required')
    .bail()
    .custom((value: EATTRIBUTE_NAME) =>
      isInEnum('attribute name', value, EATTRIBUTE_NAME)
    ),

  body('attributes.*.value').if((_, { req }) =>
    attributesExists(req as ICreateProductRequest)
  ),
  // .exists({ checkFalsy: true })
  // .withMessage('attribute value is required'),
  body('tenantId')
    .optional()
    .isUUID()
    .withMessage('please provide a valid tenant id'),

  body('categoryId')
    .optional()
    .isMongoId()
    .withMessage('please provide a valid category id'),

  body('removePriceConfigurationOrAttribute')
    .optional()
    .customSanitizer((config) => {
      if (typeof config === 'string') {
        if (!isValidJSON(config))
          throw new Error('please provide valid data for removing keys');

        const parsedConfig = JSON.parse(config);

        return parsedConfig;
      }

      return config;
    }),

  body('isPublished').customSanitizer((isPublished) => {
    return typeof isPublished === 'string' && isPublished === 'true'
      ? true
      : false;
  }),

  body('removePriceConfigurationOrAttribute.priceConfigurationKeys')
    .optional()
    .isArray()
    .withMessage(
      'please provide a list of price configuration keys to be deleted'
    )
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

const attributesExists = (req: ICreateProductRequest) =>
  req.body.attributes?.filter((o) => !!o).length > 0;

const isValidJSON = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};
