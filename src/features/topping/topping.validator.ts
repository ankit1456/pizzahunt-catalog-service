import { MAX_FILE_SIZE } from '@common/constants';
import { body } from 'express-validator';

export const createToppingValidator = [
  body('toppingName')
    .trim()
    .notEmpty()
    .withMessage('topping name is required')
    .bail()
    .custom((value) => {
      if (!isNaN(value)) throw new Error('please provide a valid topping name');
      return true;
    })
    .bail()
    .isLength({ min: 3 })
    .withMessage('topping name is too short'),

  body('image').custom((value, { req }) => {
    if (!req.files || !req.files.image)
      throw new Error('topping image is required');

    const image = req.files?.image;

    if (image?.size > MAX_FILE_SIZE)
      throw new Error('topping image must be less than 500kb');

    return true;
  }),

  body('price')
    .exists({ checkFalsy: true })
    .withMessage('topping price is required')
    .bail()
    .isNumeric()
    .withMessage('topping price should be a number'),

  body('tenantId')
    .exists({ checkFalsy: true })
    .withMessage('tenant id is required')
    .bail()
    .isUUID()
    .withMessage('please provide a valid tenant id')
];

export const updateToppingValidator = [
  body('toppingName')
    .optional()
    .trim()
    .custom((value) => {
      if (!isNaN(value)) throw new Error('please provide a valid topping name');
      return true;
    })
    .bail()
    .isLength({ min: 3 })
    .withMessage('topping name is too short'),

  body('image')
    .optional()
    .custom((value, { req }) => {
      const image = req.files?.image;

      if (image?.size > MAX_FILE_SIZE)
        throw new Error('topping image must be less than 500kb');

      return true;
    }),

  body('price')
    .optional()
    .isNumeric()
    .withMessage('topping price should be a number'),

  body('tenantId')
    .optional()
    .isUUID()
    .withMessage('please provide a valid tenant id')
];
