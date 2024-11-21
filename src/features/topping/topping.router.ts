import { ERoles } from '@common/constants';
import { authenticate, canAccess, sanitizeRequest } from '@common/middlewares';
import {
  idValidator,
  queryParamsValidator
} from '@common/middlewares/validators';
import {
  CloudinaryStorage
  // S3Storage
} from '@common/services';
import { catchAsync } from '@common/utils';
import { logger } from '@config';
import ToppingController from '@features/topping/topping.controller';
import ToppingService from '@features/topping/topping.service';
import {
  createToppingValidator,
  updateToppingValidator
} from '@features/topping/topping.validator';
import { Router } from 'express';
import fileUpload from 'express-fileupload';

const router = Router();

// const s3Storage = new S3Storage();
const cloudinaryStorage = new CloudinaryStorage();
const toppingService = new ToppingService();
const toppingController = new ToppingController(
  toppingService,
  cloudinaryStorage,
  // s3Storage,
  logger
);

router
  .route('/')
  .get(queryParamsValidator, catchAsync(toppingController.getToppings))
  .post(
    authenticate,
    canAccess(ERoles.ADMIN, ERoles.MANAGER),
    fileUpload(),
    createToppingValidator,
    sanitizeRequest,
    catchAsync(toppingController.createTopping)
  );

router
  .route('/:toppingId')
  .get(
    idValidator('toppingId'),
    sanitizeRequest,
    catchAsync(toppingController.getTopping)
  )
  .delete(
    authenticate,
    canAccess(ERoles.ADMIN, ERoles.MANAGER),
    idValidator('toppingId'),
    sanitizeRequest,
    catchAsync(toppingController.deleteTopping)
  )
  .patch(
    authenticate,
    canAccess(ERoles.ADMIN, ERoles.MANAGER),
    idValidator('toppingId'),
    fileUpload(),
    updateToppingValidator,
    sanitizeRequest,
    catchAsync(toppingController.updateTopping)
  );

export default router;
