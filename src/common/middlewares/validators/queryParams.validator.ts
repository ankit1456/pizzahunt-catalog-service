import { DEFAULT_PAGE_SIZE } from '@src/config/pagination';
import { checkSchema as validationSchema } from 'express-validator';

export default validationSchema(
  {
    page: {
      toInt: true,
      customSanitizer: {
        options: (value: number) => (Number.isNaN(value) ? 1 : value)
      }
    },
    limit: {
      toInt: true,
      customSanitizer: {
        options: (value: number) =>
          Number.isNaN(value) ? DEFAULT_PAGE_SIZE : value
      }
    },
    q: {
      trim: true,
      customSanitizer: {
        options: (value: string) => value ?? ''
      }
    },
    tenantId: {
      trim: true,
      optional: true
    },
    categoryId: {
      trim: true,
      optional: true
    },
    isPublished: {
      optional: true,
      customSanitizer: {
        options: (value: string) => (value === 'true' ? true : false)
      }
    }
  },
  ['query']
);
