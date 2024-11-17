import { IQueryParams } from '@common/types';
import { paginationLabels } from '@config';
import { CategoryModel, ICategory } from '@features/category';

export default class CategoryService {
  create(category: ICategory) {
    const newCategory = new CategoryModel(category);

    return newCategory.save();
  }

  getAll({ page, limit }: IQueryParams) {
    return CategoryModel.paginate(
      {},
      {
        page,
        limit,
        customLabels: paginationLabels
      }
    );
  }

  getOne(categoryId: string | undefined) {
    return CategoryModel.findById(categoryId);
  }

  delete(categoryId: string | undefined) {
    return CategoryModel.findByIdAndDelete(categoryId);
  }

  update(
    categoryId: string | undefined,
    { categoryName, priceConfiguration, attributes }: ICategory
  ) {
    return CategoryModel.findByIdAndUpdate(
      categoryId,
      {
        categoryName,
        priceConfiguration,
        attributes
      },
      {
        new: true
      }
    );
  }
}
