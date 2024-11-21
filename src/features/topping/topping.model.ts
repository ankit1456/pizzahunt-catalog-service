import { ITopping } from '@features/topping';
import mongoose, { PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const toppingSchema = new mongoose.Schema<ITopping>(
  {
    toppingName: {
      type: String,
      required: true
    },
    image: {
      imageId: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    },
    price: { type: Number, required: true },
    tenantId: {
      type: String,
      required: true
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

toppingSchema.plugin(mongoosePaginate);

export default mongoose.model<ITopping, PaginateModel<ITopping>>(
  'Topping',
  toppingSchema
);
