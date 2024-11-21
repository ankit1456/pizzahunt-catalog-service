import { EStatus } from '@common/constants';
import { NotFoundError } from '@common/errors';
import { IQueryParams } from '@common/types';
import { CategoryService, ICreateCategoryRequest } from '@features/category';
import {
  IAttribute,
  IPriceConfiguration,
  IUpdateCategoryRequest
} from '@features/category/category.types';
import { NextFunction, Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { Logger } from 'winston';

export default class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly logger: Logger
  ) {
    this.createCategory = this.createCategory.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
  }

  async getCategories(req: Request, res: Response) {
    const queryParams = matchedData<IQueryParams>(req, {
      onlyValidData: true
    });

    const result = await this.categoryService.getAll(queryParams);

    this.logger.info('All categories fetched', queryParams);

    return res.json({
      status: EStatus.SUCCESS,
      ...result
    });
  }

  async getCategory(req: Request, res: Response, next: NextFunction) {
    const { categoryId } = req.params;

    const category = await this.categoryService.getOne(categoryId);

    if (!category) return next(new NotFoundError('Category not found'));

    this.logger.info('Category fetched', {
      id: categoryId
    });

    return res.json({ status: EStatus.SUCCESS, category });
  }

  async createCategory(req: ICreateCategoryRequest, res: Response) {
    this.logger.debug('Creating category', req.body);

    const category = await this.categoryService.create(req.body);

    this.logger.info('Category has been created', {
      id: category._id
    });
    return res.status(201).json({ status: EStatus.SUCCESS, category });
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    const { categoryId } = req.params;

    this.logger.info('Deleting category', {
      id: categoryId
    });

    const response = await this.categoryService.delete(categoryId);

    if (!response) return next(new NotFoundError('Category not found'));

    this.logger.info('Category deleted', {
      id: categoryId
    });

    return res.json({ status: EStatus.SUCCESS });
  }

  async updateCategory(
    req: IUpdateCategoryRequest,
    res: Response,
    next: NextFunction
  ) {
    const { categoryId } = req.params;

    this.logger.info('Updating category', {
      id: categoryId
    });

    const category = await this.categoryService.getOne(categoryId);

    if (!category) return next(new NotFoundError('Category not found'));

    const { removePriceConfigurationOrAttribute } = req.body;

    const serializedPriceConfiguration = this.serializePriceConfiguration(
      removePriceConfigurationOrAttribute?.priceConfigurationKeys,
      category.priceConfiguration,
      req.body.priceConfiguration
    );

    const serializedAttributes = this.serializeAttributes(
      category.attributes,
      req.body.attributes,
      removePriceConfigurationOrAttribute?.attributeNames
    );

    this.logger.info('Category updated', {
      id: categoryId
    });

    const updatedCategory = await this.categoryService.update(categoryId, {
      categoryName: req.body.categoryName,
      priceConfiguration: serializedPriceConfiguration,
      attributes: serializedAttributes
    });

    return res.json({
      status: EStatus.SUCCESS,
      category: updatedCategory
    });
  }

  private serializePriceConfiguration(
    keysToRemove: string[] | undefined,
    existingPriceConfiguration: IPriceConfiguration,
    newPriceConfiguration: IPriceConfiguration
  ) {
    keysToRemove?.forEach((key) => existingPriceConfiguration.delete(key));

    return {
      ...Object.fromEntries(existingPriceConfiguration),
      ...newPriceConfiguration
    };
  }

  private serializeAttributes(
    existingAttributes: IAttribute[],
    newAttributes?: IAttribute[],
    attributeNamesToRemove?: string[] | undefined
  ) {
    const attributesToRemove = new Set(attributeNamesToRemove);
    const newAttributNames = new Set(
      newAttributes?.map((attr) => attr.attributeName)
    );

    const filteredAttributes = existingAttributes.filter(
      (attribute) =>
        !attributesToRemove.has(attribute.attributeName) &&
        !newAttributNames.has(attribute.attributeName)
    );

    return newAttributes?.length
      ? filteredAttributes.concat(newAttributes)
      : filteredAttributes;
  }
}
