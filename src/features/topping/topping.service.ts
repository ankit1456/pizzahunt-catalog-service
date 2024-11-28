import { IFilters, IQueryParams } from '@common/types';
import { paginationLabels } from '@config';
import { ITopping, ToppingModel } from '@features/topping';

export default class ToppingService {
  create(toppping: ITopping) {
    const newTopping = new ToppingModel(toppping);
    return newTopping.save();
  }

  getAll({ page, limit, q }: IQueryParams, filters: IFilters) {
    const searchQueryRegExp = new RegExp(q, 'i');
    const matchQuery = {
      ...filters,
      toppingName: searchQueryRegExp
    };

    return ToppingModel.paginate(matchQuery, {
      page,
      limit,
      customLabels: paginationLabels
    });
  }
  getOne(toppingId: string | undefined) {
    return ToppingModel.findById(toppingId);
  }

  delete(toppingId: string | undefined) {
    return ToppingModel.findByIdAndDelete(toppingId);
  }

  update(toppingId: string | undefined, toppingPayload: ITopping) {
    return ToppingModel.findByIdAndUpdate(toppingId, toppingPayload, {
      new: true
    });
  }
}
