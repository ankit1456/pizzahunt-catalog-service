import { EATTRIBUTE_NAME, EPRICE_TYPE, EWIDGET_TYPE } from '@common/constants';
import { IAttribute, ICategory } from '@features/category';
import mongoose from 'mongoose';

const priceConfigurationSchema = new mongoose.Schema(
  {
    priceType: {
      type: String,
      enum: EPRICE_TYPE,
      required: true
    },
    availableOptions: {
      type: [String],
      required: true
    }
  },
  { _id: false }
);

const attributeSchema = new mongoose.Schema<IAttribute>(
  {
    attributeName: {
      type: String,
      enum: EATTRIBUTE_NAME,
      required: true
    },
    widgetType: {
      type: String,
      enum: EWIDGET_TYPE,
      required: true
    },
    defaultValue: {
      type: String,
      required: true
    },
    availableOptions: {
      type: [String],
      required: true
    }
  },
  { _id: false }
);

const categorySchema = new mongoose.Schema<ICategory>(
  {
    categoryName: {
      type: String,
      required: true
    },
    priceConfiguration: {
      type: Map,
      of: priceConfigurationSchema,
      required: true
    },
    attributes: {
      type: [attributeSchema],
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Category', categorySchema);
