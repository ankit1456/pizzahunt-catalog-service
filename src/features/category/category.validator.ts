import { body } from 'express-validator';
import { TPriceType } from './category.types';

export default [
  body('name')
    .exists()
    .withMessage('category name is required')
    .isString()
    .withMessage('category name should be a string'),

  body('priceConfiguration')
    .exists()
    .withMessage('priceConfiguration is required'),
  body('priceConfiguration.*.priceType')
    .exists()
    .withMessage('priceType is required')
    .custom((value: TPriceType) => {
      const validKeys = ['base', 'additional'];

      if (!validKeys.includes(value)) {
        throw new Error(
          `priceType can only be one of these ${validKeys.join(
            ', '
          )}.${value} is invalid`
        );
      }

      return true;
    }),
  body('attributes').exists().withMessage('attributes are required')
];
