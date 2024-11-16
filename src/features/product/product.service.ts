import { IProduct, ProductModel } from '@features/product';

export default class ProductService {
  create(product: IProduct) {
    const newProduct = new ProductModel(product);

    return newProduct.save();
  }

  // getAll(queryParams: IQueryParams) {
  //   return paginate<ICategory>(CategoryModel, queryParams);
  // }

  getOne(productId: string | undefined) {
    return ProductModel.findById(productId);
  }

  // delete(categoryId: string | undefined) {
  //   return CategoryModel.findByIdAndDelete(categoryId);
  // }

  update(productId: string | undefined, productPayload: IProduct) {
    return ProductModel.findByIdAndUpdate(productId, productPayload, {
      new: true
    });
  }
}
