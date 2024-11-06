import { IQueryParams } from '../types';
import { Model } from 'mongoose';

async function paginate<T>(model: Model<T>, { page, limit }: IQueryParams) {
  const skip = (page - 1) * limit;

  const totalCount = await model.countDocuments();
  const data = await model.find().skip(skip).limit(limit);

  return { page, limit, totalCount, data };
}

export default paginate;
