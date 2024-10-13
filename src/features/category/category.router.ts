import { Router } from 'express';
import { logger } from '../../config';
import CategoryController from './category.controller';
import CategoryService from './category.service';
import categoryValidator from './category.validator';
// import authenticate from '../../common/middlewares/authenticate';

const router = Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService, logger);

router.post(
  '/',
  // authenticate,
  categoryValidator,
  categoryController.create
);

export default router;
