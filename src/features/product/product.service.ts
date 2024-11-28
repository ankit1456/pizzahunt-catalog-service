import { IFilters, IQueryParams } from '@common/types';
import { paginationLabels } from '@config';
import { IProduct, ProductModel } from '@features/product';

export default class ProductService {
  create(product: IProduct) {
    const newProduct = new ProductModel(product);

    return newProduct.save();
  }

  getAll({ page, limit, q }: IQueryParams, filters: IFilters) {
    const searchQueryRegExp = new RegExp(q, 'i');

    const matchQuery = {
      ...filters,
      $or: [
        { productName: searchQueryRegExp },
        { description: searchQueryRegExp }
      ]
    };

    const aggregate = ProductModel.aggregate<IProduct>([
      {
        $match: matchQuery
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
          pipeline: [
            {
              $project: {
                _id: 1,
                categoryName: 1,
                priceConfiguration: 1,
                attributes: 1
              }
            }
          ]
        }
      },
      {
        $unwind: '$category'
      }
    ]);

    return ProductModel.aggregatePaginate(aggregate, {
      page,
      limit,
      customLabels: paginationLabels
    });
  }

  getOne(productId: string | undefined) {
    return ProductModel.findById(productId);
  }

  delete(productId: string | undefined) {
    return ProductModel.findByIdAndDelete(productId);
  }

  update(productId: string | undefined, productPayload: IProduct) {
    return ProductModel.findByIdAndUpdate(productId, productPayload, {
      new: true
    });
  }
}
