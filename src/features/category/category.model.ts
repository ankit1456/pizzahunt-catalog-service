import mongoose from 'mongoose';

export interface ICategory {
  name: string;
  priceConfiguration: IPriceConfiguration;
  attributes: Array<IAttribute>;
}

interface IPriceConfiguration {
  [key: string]: {
    priceType: 'base' | 'additional';
    availableOptions: Array<string>;
  };
}

interface IAttribute {
  name: string;
  widgetType: 'switch' | 'radio';
  defaultValue: string;
  availableOptions: Array<string>;
}

const priceConfigurationSchema = new mongoose.Schema<IPriceConfiguration>({
  priceType: {
    type: String,
    enum: ['base', 'additional'],
    required: true
  },
  availableOptions: {
    type: [String],
    required: true
  }
});

const attributeSchema = new mongoose.Schema<IAttribute>({
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
});

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
