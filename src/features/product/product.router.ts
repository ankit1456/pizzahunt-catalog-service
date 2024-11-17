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
import ProductController from '@features/product/product.controller';
import ProductService from '@features/product/product.service';
import {
  createProductValidator,
  updateProductValidator
} from '@features/product/product.validator';
import { Router } from 'express';
import fileUpload from 'express-fileupload';

const router = Router();

const productService = new ProductService();
// const s3Storage = new S3Storage();
const cloudinaryStorage = new CloudinaryStorage();
const productController = new ProductController(
  productService,
  cloudinaryStorage,
  logger
);

router
  .route('/')
  .get(queryParamsValidator, catchAsync(productController.getProducts))
  .post(
    authenticate,
    canAccess(ERoles.ADMIN, ERoles.MANAGER),
    fileUpload(),
    createProductValidator,
    sanitizeRequest,
    catchAsync(productController.createProduct)
  );

router
  .route('/:productId')
  //   .get(
  //     idValidator('categoryId'),
  //     sanitizeRequest,
  //     catchAsync(categoryController.getCategory)
  //   )
  //   .delete(
  //     authenticate,
  //     canAccess(ERoles.ADMIN),
  //     idValidator('categoryId'),
  //     sanitizeRequest,
  //     catchAsync(categoryController.deleteCategory)
  //   )
  .patch(
    authenticate,
    canAccess(ERoles.ADMIN, ERoles.MANAGER),
    idValidator('productId'),
    fileUpload(),
    updateProductValidator,
    sanitizeRequest,
    catchAsync(productController.updateProduct)
  );

export default router;
