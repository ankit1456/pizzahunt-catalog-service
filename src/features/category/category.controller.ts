import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import { Logger } from 'winston';
import { ValidationError } from '../../common/utils/errors';
import CategoryService from './category.service';
import { ICreateCategoryRequest } from './category.types';

export default class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly logger: Logger
  ) {
    this.createCategory = this.createCategory.bind(this);
  }

  async createCategory(
    req: ICreateCategoryRequest,
    res: Response,
    next: NextFunction
  ) {
    const result = validationResult(req);
    const { categoryName, priceConfiguration, attributes } = req.body;

    this.logger.debug('Creating category', {
      categoryName,
      priceConfiguration,
      attributes
    });

    if (!result.isEmpty()) return next(new ValidationError(result.array()));

    const category = await this.categoryService.create({
      categoryName,
      priceConfiguration,
      attributes
    });

    this.logger.info('Category has been created', {
      id: category._id
    });
    res.json({ id: category._id });
  }
}
