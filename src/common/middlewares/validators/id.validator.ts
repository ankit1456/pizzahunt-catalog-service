import { checkSchema as validationSchema } from 'express-validator';

const idValidator = (paramName: string) => {
  return validationSchema({
    [paramName]: {
      in: ['params'],
      isMongoId: {
        errorMessage: `${paramName} is not valid`
      }
    }
  });
};

export default idValidator;
