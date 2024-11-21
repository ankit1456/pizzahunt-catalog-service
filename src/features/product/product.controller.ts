import { ERoles, EStatus } from '@common/constants';
import { ForbiddenError, NotFoundError } from '@common/errors';
import { IFileStorage, IFilters } from '@common/types';
import {
  IAttribute,
  ICreateProductRequest,
  IDeleteProductRequest,
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
    this.getProduct = this.getProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
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

  async getProduct(req: Request, res: Response, next: NextFunction) {
    const { productId } = req.params;

    const product = await this.productService.getOne(productId);

    if (!product) return next(new NotFoundError('Product not found'));

    this.logger.info('Product fetched', {
      id: productId
    });

    return res.json({ status: EStatus.SUCCESS, product });
  }

  async createProduct(_req: Request, res: Response, next: NextFunction) {
    const req = _req as ICreateProductRequest;
    this.logger.debug('Creating product', req.body);

    const { tenantId, role } = req.auth!;
    if (req.body.tenantId !== tenantId && role !== ERoles.ADMIN)
      return next(
        new ForbiddenError(
          'You are not authorized to create product for this tenant'
        )
      );

    const image = req.files?.image as UploadedFile;

    const imageName = uuid();

    const uploadedImage = await this.storage.upload({
      filename: imageName,
      fileData: image?.data.buffer,
      folder: 'products'
    });

    const product = await this.productService.create({
      ...req.body,
      image: uploadedImage
    });

    this.logger.info('Product has been created', { id: product._id });
    return res.status(201).json({ status: EStatus.SUCCESS, product });
  }

  async updateProduct(_req: Request, res: Response, next: NextFunction) {
    const req = _req as IUpdateProductRequest;
    const { productId } = req.params;

    this.logger.info('Updating product', {
      id: productId
    });

    const product = await this.productService.getOne(productId);
    if (!product) return next(new NotFoundError('Product not found'));

    const { role, tenantId } = req.auth!;

    if (product.tenantId !== tenantId && role !== ERoles.ADMIN)
      return next(
        new ForbiddenError('You are not authorized to update this product')
      );

    const newImage = {
      imageId: '',
      url: ''
    };
    const prevImage = product.image.imageId;

    if (req.files?.image) {
      const image = req.files.image as UploadedFile;
      newImage.imageId = uuid();

      const { url } = await this.storage.upload({
        filename: newImage.imageId,
        fileData: image?.data.buffer,
        folder: 'products'
      });

      newImage.url = url;
      await this.storage.delete(`products/${prevImage}`);
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
      image: newImage.imageId && newImage.url ? newImage : product.image
    });

    this.logger.info('Product updated', {
      id: productId
    });

    return res.json({ status: EStatus.SUCCESS, product: updatedProduct });
  }

  async deleteProduct(_req: Request, res: Response, next: NextFunction) {
    const req = _req as IDeleteProductRequest;

    const { productId } = req.params;

    this.logger.info('Deleting product', {
      id: productId
    });

    const product = await this.productService.delete(productId);
    if (!product) return next(new NotFoundError('Product not found'));

    const { tenantId, role } = req.auth;

    if (product.tenantId !== tenantId && role !== ERoles.ADMIN)
      return next(
        new ForbiddenError('You are not authorized to delete this product')
      );

    const response = await this.productService.delete(productId);
    await this.storage.delete(`products/${response?.image.imageId}`);

    this.logger.info('Product deleted', {
      id: productId
    });

    return res.json({ status: EStatus.SUCCESS });
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
