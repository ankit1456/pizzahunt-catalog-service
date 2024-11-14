import { IProduct, ProductModel } from '@features/product';

export default class ProductService {
  create(product: IProduct) {
    const newProduct = new ProductModel(product);

    return newProduct.save();
  }

  // getAll(queryParams: IQueryParams) {
  //   return paginate<ICategory>(CategoryModel, queryParams);
  // }

  // getOne(categoryId: string | undefined) {
  //   return CategoryModel.findById(categoryId);
  // }

  // delete(categoryId: string | undefined) {
  //   return CategoryModel.findByIdAndDelete(categoryId);
  // }

  // update(
  //   categoryId: string | undefined,
  //   { categoryName, priceConfiguration, attributes }: ICategory
  // ) {
  //   return CategoryModel.findByIdAndUpdate(
  //     categoryId,
  //     {
  //       categoryName,
  //       priceConfiguration,
  //       attributes
  //     },
  //     {
  //       new: true
  //     }
  //   );
  // }
}
