import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import CategoryService from './category.service';
import { ICreateCategoryRequest } from './category.types';
import { Logger } from 'winston';

export default class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly logger: Logger
  ) {
    this.create = this.create.bind(this);
  }

  async create(req: ICreateCategoryRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);
    const { name, priceConfiguration, attributes } = req.body;

    this.logger.debug('Creating category', {
      name,
      priceConfiguration,
      attributes
    });

    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0]?.msg as string));
    }

    const category = await this.categoryService.create({
      name,
      priceConfiguration,
      attributes
    });
    this.logger.debug('Category has been created', {
      id: category._id
    });
    res.json({ id: category._id });
  }
}
