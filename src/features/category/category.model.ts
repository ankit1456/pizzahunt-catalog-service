import mongoose from 'mongoose';
import {
  IPriceConfiguration,
  IAttribute,
  ICategory,
  EWIDGET_TYPE,
  EPRICE_TYPE,
  EATTRIBUTE_NAME
} from './category.types';

const priceConfigurationSchema = new mongoose.Schema<IPriceConfiguration>(
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
