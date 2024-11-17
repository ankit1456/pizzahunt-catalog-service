import { EATTRIBUTE_NAME, EPRICE_TYPE } from '@common/constants';
import { IAttribute, IProduct } from '@features/product';
import mongoose, { AggregatePaginateModel } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const priceConfigurationSchema = new mongoose.Schema(
  {
    priceType: {
      type: String,
      enum: EPRICE_TYPE
    },
    availableOptions: {
      type: Map,
      of: Number
    }
  },
  { _id: false }
);

const attributeSchema = new mongoose.Schema<IAttribute>(
  {
    attributeName: {
      type: String,
      enum: EATTRIBUTE_NAME
    },
    value: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema<IProduct>(
  {
    productName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    priceConfiguration: {
      type: Map,
      of: priceConfigurationSchema
    },
    attributes: {
      type: [attributeSchema]
    },
    tenantId: {
      type: String,
      required: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
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

productSchema.plugin(aggregatePaginate);

export default mongoose.model<IProduct, AggregatePaginateModel<IProduct>>(
  'Product',
  productSchema
);
