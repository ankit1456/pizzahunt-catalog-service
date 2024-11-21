import { ERoles, EStatus } from '@common/constants';
import { ForbiddenError, NotFoundError } from '@common/errors';
import { IFileStorage, IFilters } from '@common/types';
import {
  ICreateToppingRequest,
  IDeleteToppingRequest,
  IToppingQueryParams,
  IUpdateToppingRequest,
  ToppingService
} from '@features/topping';
import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { matchedData } from 'express-validator';
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';

export default class ToppingController {
  constructor(
    private readonly toppingService: ToppingService,
    private readonly storage: IFileStorage,
    private readonly logger: Logger
  ) {
    this.createTopping = this.createTopping.bind(this);
    this.updateTopping = this.updateTopping.bind(this);
    this.getToppings = this.getToppings.bind(this);
    this.getTopping = this.getTopping.bind(this);
    this.deleteTopping = this.deleteTopping.bind(this);
  }

  async getToppings(req: Request, res: Response) {
    const queryParams = matchedData<IToppingQueryParams>(req, {
      onlyValidData: true
    });

    const { limit, page, q, isPublished, tenantId } = queryParams;

    const filters: IFilters = {};

    if (isPublished) filters.isPublished = true;
    if (tenantId) filters.tenantId = tenantId;

    const result = await this.toppingService.getAll(
      { page, limit, q },
      filters
    );

    this.logger.info('All products fetched', queryParams);

    return res.json({
      status: EStatus.SUCCESS,
      ...result
    });
  }

  async getTopping(req: Request, res: Response, next: NextFunction) {
    const { toppingId } = req.params;

    const topping = await this.toppingService.getOne(toppingId);

    if (!topping) return next(new NotFoundError('Topping not found'));

    this.logger.info('Topping fetched', {
      id: toppingId
    });

    return res.json({ status: EStatus.SUCCESS, topping });
  }

  async createTopping(_req: Request, res: Response, next: NextFunction) {
    const req = _req as ICreateToppingRequest;
    this.logger.debug('Creating topping', req.body);

    const { tenantId, role } = req.auth!;
    if (req.body.tenantId !== tenantId && role !== ERoles.ADMIN)
      return next(
        new ForbiddenError(
          'You are not authorized to create topping for this tenant'
        )
      );

    const image = req.files?.image as UploadedFile;

    const imageName = uuid();

    const uploadedImage = await this.storage.upload({
      filename: imageName,
      fileData: image?.data.buffer,
      folder: 'toppings'
    });

    const topping = await this.toppingService.create({
      ...req.body,
      image: uploadedImage
    });

    this.logger.info('Topping has been created', { id: topping._id });
    return res.status(201).json({ status: EStatus.SUCCESS, topping });
  }

  async deleteTopping(_req: Request, res: Response, next: NextFunction) {
    const req = _req as IDeleteToppingRequest;
    const { toppingId } = req.params;

    this.logger.info('Deleting topping', {
      id: toppingId
    });

    const topping = await this.toppingService.getOne(toppingId);

    if (!topping) return next(new NotFoundError('Topping not found'));

    const { tenantId, role } = req.auth;
    if (topping.tenantId !== tenantId && role !== ERoles.ADMIN)
      return next(
        new ForbiddenError('You are not authorized to delete this topping')
      );

    const response = await this.toppingService.delete(toppingId);

    await this.storage.delete(`toppings/${response?.image.imageId}`);

    this.logger.info('Topping deleted', {
      id: toppingId
    });

    return res.json({ status: EStatus.SUCCESS });
  }

  async updateTopping(_req: Request, res: Response, next: NextFunction) {
    const req = _req as IUpdateToppingRequest;
    const { toppingId } = req.params;

    this.logger.info('Updating topping', {
      id: toppingId
    });

    const topping = await this.toppingService.getOne(toppingId);
    if (!topping) return next(new NotFoundError('Topping not found'));

    const { role, tenantId } = req.auth!;

    if (topping.tenantId !== tenantId && role !== ERoles.ADMIN)
      return next(
        new ForbiddenError('You are not authorized to update this topping')
      );

    const newImage = {
      imageId: '',
      url: ''
    };
    const prevImage = topping.image.imageId;

    if (req.files?.image) {
      const image = req.files.image as UploadedFile;
      newImage.imageId = uuid();

      const { url } = await this.storage.upload({
        filename: newImage.imageId,
        fileData: image?.data.buffer,
        folder: 'toppings'
      });

      newImage.url = url;
      await this.storage.delete(`toppings/${prevImage}`);
    }

    const updatedTopping = await this.toppingService.update(toppingId, {
      ...req.body,
      image: newImage.imageId && newImage.url ? newImage : topping.image
    });

    this.logger.info('Topping updated', {
      id: toppingId
    });

    return res.json({ status: EStatus.SUCCESS, product: updatedTopping });
  }
}
