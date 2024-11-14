import {
  authenticate,
  canAccess,
  fileUploader,
  sanitizeRequest
} from '@common/middlewares';
import { S3Storage } from '@common/services/S3Storage.service';
import { ERoles } from '@common/types';
import { catchAsync } from '@common/utils';
import { logger } from '@config';
import ProductController from '@features/product/product.controller';
import ProductService from '@features/product/product.service';
import { createProductValidator } from '@features/product/product.validator';
import { Router } from 'express';

const router = Router();

const productService = new ProductService();
const s3Storage = new S3Storage();
const productController = new ProductController(
  productService,
  s3Storage,
  logger
);

router
  .route('/')
  // .get(queryParamsValidator, catchAsync(categoryController.getCategories))
  .post(
    authenticate,
    canAccess(ERoles.ADMIN, ERoles.MANAGER),
    fileUploader,
    createProductValidator,
    sanitizeRequest,
    catchAsync(productController.createProduct)
  );

// router
//   .route('/:categoryId')
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
//   .patch(
//     authenticate,
//     canAccess(ERoles.ADMIN),
//     idValidator('categoryId'),
//     updateCategoryValidator,
//     sanitizeRequest,
//     catchAsync(categoryController.updateCategory)
//   );

export default router;
