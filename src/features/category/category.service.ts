import CategoryModel from './category.model';
import { ICategory } from './category.types';

export default class CategoryService {
  create(category: ICategory) {
    const newCategory = new CategoryModel(category);

    return newCategory.save();
  }
}
