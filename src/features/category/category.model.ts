import mongoose from 'mongoose';
import { IPriceConfiguration, IAttribute, ICategory } from './category.types';

const priceConfigurationSchema = new mongoose.Schema<IPriceConfiguration>(
  {
    priceType: {
      type: String,
      enum: ['base', 'additional'],
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
    name: {
      type: String,
      required: true
    },
    widgetType: {
      type: String,
      enum: ['switch', 'radio'],
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

const categorySchema = new mongoose.Schema<ICategory>({
  name: {
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
});

export default mongoose.model('Category', categorySchema);
