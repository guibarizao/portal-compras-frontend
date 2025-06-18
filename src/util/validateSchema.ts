import * as yup from 'yup';
import IFormError from '../interfaces/IFormError';

interface IFormErrorResult {
  errors: IFormError | null;
  isValid: boolean;
}

export const validateSchema = <T>() => {
  const validate = async (schema: yup.AnySchema, object: T): Promise<IFormErrorResult> => {
    const isValid = await schema
      .isValid(object)
      .then(result => result)
      .catch();

    const validationResult = await schema.validate(object, { abortEarly: false }).catch(error => {
      return error;
    });
    let errors: IFormError | null = null;
    validationResult?.inner?.forEach((result: any) => {
      errors = {
        ...errors,
        [result.path]: result.message,
      };
    });
    return {
      errors,
      isValid,
    };
  };
  return { validate };
};
