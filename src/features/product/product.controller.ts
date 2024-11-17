import { ERoles, EStatus } from '@common/constants';
import { ForbiddenError, NotFoundError } from '@common/errors';
import { IFileStorage } from '@common/types';
import {
  IAttribute,
  ICreateProductRequest,
  IFilters,
  IPriceConfiguration,
  IProductQueryParams,
  IUpdateProductRequest,
  ProductService
} from '@features/product';
import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { matchedData } from 'express-validator';
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';

export default class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly storage: IFileStorage,
    private readonly logger: Logger
  ) {
    this.createProduct = this.createProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.getProducts = this.getProducts.bind(this);
    // this.getCategory = this.getCategory.bind(this);
    // this.deleteCategory = this.deleteCategory.bind(this);
    // this.updateCategory = this.updateCategory.bind(this);
  }

  async getProducts(req: Request, res: Response) {
    const queryParams = matchedData<IProductQueryParams>(req, {
      onlyValidData: true
    });

    const { limit, page, q, isPublished, tenantId, categoryId } = queryParams;

    const filters: IFilters = {};

    if (isPublished) filters.isPublished = true;
    if (tenantId) filters.tenantId = tenantId;
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId))
      filters.categoryId = new mongoose.Types.ObjectId(categoryId);

    const result = await this.productService.getAll(
      { page, limit, q },
      filters
    );

    this.logger.info('All products fetched', queryParams);

    return res.json({
      status: EStatus.SUCCESS,
      ...result
    });
  }

  // async getCategory(req: Request, res: Response, next: NextFunction) {
  //   const { categoryId } = req.params;

  //   const category = await this.categoryService.getOne(categoryId);

  //   if (!category) return next(new NotFoundError('Category not found'));

  //   this.logger.info('Category fetched', {
  //     id: categoryId
  //   });

  //   res.json({ status: EStatus.SUCCESS, category });
  // }
  async createProduct(req: ICreateProductRequest, res: Response) {
    const {
      productName,
      description,
      priceConfiguration,
      attributes,
      categoryId,
      isPublished,
      tenantId
    } = req.body;

    this.logger.debug('Creating product', req.body);

    const image = req.files!.image as UploadedFile;

    const imageName = uuid();

    await this.storage.upload({
      filename: imageName,
      fileData: image?.data.buffer
    });

    const product = await this.productService.create({
      productName,
      description,
      priceConfiguration,
      attributes,
      categoryId,
      image: imageName,
      isPublished,
      tenantId
    });

    this.logger.info('Product has been created', { id: product._id });
    return res.status(201).json({ status: EStatus.SUCCESS, product });
  }

  // async deleteCategory(req: Request, res: Response, next: NextFunction) {
  //   const { categoryId } = req.params;

  //   this.logger.info('Deleting category', {
  //     id: categoryId
  //   });

  //   const response = await this.categoryService.delete(categoryId);

  //   if (!response) return next(new NotFoundError('Category not found'));

  //   this.logger.info('Category deleted', {
  //     id: categoryId
  //   });

  //   res.json({ status: EStatus.SUCCESS });
  // }

  async updateProduct(_req: Request, res: Response, next: NextFunction) {
    const req = _req as IUpdateProductRequest;
    const { productId } = req.params;

    this.logger.info('Updating product', {
      id: productId
    });

    const product = await this.productService.getOne(productId);
    if (!product) return next(new NotFoundError('Product not found'));

    const { role, tenantId } = req.auth;

    if (product.tenantId !== tenantId && role !== ERoles.ADMIN)
      return next(
        new ForbiddenError('You are not authorized to update this product')
      );

    let imageName: string | undefined;
    const prevImage = product.image;

    if (req.files?.image) {
      const image = req.files.image as UploadedFile;
      imageName = uuid();

      await this.storage.upload({
        filename: imageName,
        fileData: image?.data.buffer
      });

      await this.storage.delete(prevImage);
    }

    const serializedPriceConfiguration = this.serializePriceConfiguration(
      req.body.removePriceConfigurationOrAttribute?.priceConfigurationKeys,
      product.priceConfiguration,
      req.body.priceConfiguration
    );

    const serializedAttributes = this.serializeAttributes(
      req.body.removePriceConfigurationOrAttribute?.attributeNames,
      product.attributes,
      req.body.attributes
    );

    const updatedProduct = await this.productService.update(productId, {
      ...req.body,
      priceConfiguration: serializedPriceConfiguration,
      attributes: serializedAttributes,
      image: imageName ?? prevImage
    });

    this.logger.info('Product updated', {
      id: productId
    });

    return res.json({ status: EStatus.SUCCESS, product: updatedProduct });
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
    attributeNamesToRemove: string[] | undefined,
    existingAttributes: IAttribute[],
    newAttributes: IAttribute[]
  ) {
    const attributesToRemove = new Set(attributeNamesToRemove);
    const newAttributeNames = new Set(
      newAttributes?.map((attr) => attr.attributeName)
    );

    const filteredAttributes = existingAttributes.filter(
      (attribute) =>
        !attributesToRemove.has(attribute.attributeName) &&
        !newAttributeNames.has(attribute.attributeName)
    );

    return newAttributes?.length
      ? filteredAttributes.concat(newAttributes)
      : filteredAttributes;
  }
}
