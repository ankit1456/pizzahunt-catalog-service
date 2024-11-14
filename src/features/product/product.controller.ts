import { EStatus, IFileStorage } from '@common/types';
import { ICreateProductRequest, ProductService } from '@features/product';
import { v4 as uuid } from 'uuid';
import { Response } from 'express';
import { Logger } from 'winston';
import { UploadedFile } from 'express-fileupload';

export default class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly storage: IFileStorage,
    private readonly logger: Logger
  ) {
    this.createProduct = this.createProduct.bind(this);
    // this.getCategories = this.getCategories.bind(this);
    // this.getCategory = this.getCategory.bind(this);
    // this.deleteCategory = this.deleteCategory.bind(this);
    // this.updateCategory = this.updateCategory.bind(this);
  }

  // async getCategories(req: Request, res: Response) {
  //   const queryParams = matchedData<IQueryParams>(req, {
  //     onlyValidData: true
  //   });

  //   const categories = await this.categoryService.getAll(queryParams);

  //   this.logger.info('All categories fetched', queryParams);

  //   res.json({
  //     status: EStatus.SUCCESS,
  //     ...categories
  //   });
  // }

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
    res.status(201).json({ status: EStatus.SUCCESS, product });
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

  // async updateCategory(
  //   req: IUpdateCategoryRequest,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   const { categoryId } = req.params;

  //   this.logger.info('Updating category', {
  //     id: categoryId
  //   });

  //   const category = await this.categoryService.getOne(categoryId);

  //   if (!category) return next(new NotFoundError('Category not found'));

  //   const { removePriceConfigurationOrAttribute } = req.body;

  //   const serializedPriceConfiguration = this.serializePriceConfiguration(
  //     removePriceConfigurationOrAttribute?.priceConfiguration,
  //     category.priceConfiguration,
  //     req.body.priceConfiguration
  //   );

  //   const serializedAttributes = this.serializeAttributes(
  //     category.attributes,
  //     req.body.attributes,
  //     removePriceConfigurationOrAttribute?.attributeNames
  //   );

  //   this.logger.info('Category updated', {
  //     id: categoryId
  //   });

  //   const updatedCategory = await this.categoryService.update(categoryId, {
  //     categoryName: req.body.categoryName,
  //     priceConfiguration: serializedPriceConfiguration,
  //     attributes: serializedAttributes
  //   });

  //   res.json({
  //     status: EStatus.SUCCESS,
  //     category: updatedCategory
  //   });
  // }

  // private serializePriceConfiguration(
  //   keysToRemove: string[] | undefined,
  //   existingPriceConfiguration: IPriceConfiguration,
  //   newPriceConfiguration: IPriceConfiguration
  // ) {
  //   const priceConfigMap = new Map(existingPriceConfiguration);

  //   keysToRemove?.forEach((key) => priceConfigMap.delete(key));

  //   return {
  //     ...Object.fromEntries(existingPriceConfiguration),
  //     ...newPriceConfiguration
  //   };
  // }

  // private serializeAttributes(
  //   existingAttributes: IAttribute[],
  //   newAttributes?: IAttribute[],
  //   attributeNamesToRemove?: string[] | undefined
  // ) {
  //   const attributesToRemove = new Set(attributeNamesToRemove);
  //   const newAttributNames = new Set(
  //     newAttributes?.map((attr) => attr.attributeName)
  //   );

  //   const filteredAttributes = existingAttributes.filter(
  //     (attribute) =>
  //       !attributesToRemove.has(attribute.attributeName) &&
  //       !newAttributNames.has(attribute.attributeName)
  //   );

  //   return newAttributes?.length
  //     ? filteredAttributes.concat(newAttributes)
  //     : filteredAttributes;
  // }
}
