import { authenticate, canAccess, sanitizeRequest } from '@common/middlewares';
import {
  idValidator,
  queryParamsValidator
} from '@common/middlewares/validators';
import { ERoles } from '@common/types';
import { catchAsync } from '@common/utils';
import { logger } from '@config';
import CategoryController from '@features/category/category.controller';
import CategoryService from '@features/category/category.service';
import {
  createCategoryValidator,
  updateCategoryValidator
} from '@features/category/category.validator';
import { Router } from 'express';

const router = Router();

const categoryService = new CategoryService();

const categoryController = new CategoryController(categoryService, logger);

router
  .route('/')
  .get(queryParamsValidator, catchAsync(categoryController.getCategories))
  .post(
    authenticate,
    canAccess(ERoles.ADMIN, ERoles.MANAGER),
    createCategoryValidator,
    sanitizeRequest,
    catchAsync(categoryController.createCategory)
  );

router
  .route('/:categoryId')
  .get(
    idValidator('categoryId'),
    sanitizeRequest,
    catchAsync(categoryController.getCategory)
  )
  .delete(
    authenticate,
    canAccess(ERoles.ADMIN),
    idValidator('categoryId'),
    sanitizeRequest,
    catchAsync(categoryController.deleteCategory)
  )
  .patch(
    authenticate,
    canAccess(ERoles.ADMIN),
    idValidator('categoryId'),
    updateCategoryValidator,
    sanitizeRequest,
    catchAsync(categoryController.updateCategory)
  );

export default router;
