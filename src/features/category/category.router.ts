import { Router } from 'express';
import { authenticate, canAccess } from '../../common/middlewares';
import { ERoles } from '../../common/types';
import { catchAsync } from '../../common/utils';
import { logger } from '../../config';
import CategoryController from './category.controller';
import CategoryService from './category.service';
import categoryValidator from './category.validator';

const router = Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService, logger);

router.post(
  '/',
  authenticate,
  canAccess(ERoles.ADMIN, ERoles.MANAGER),
  categoryValidator,
  catchAsync(categoryController.createCategory)
);

export default router;
