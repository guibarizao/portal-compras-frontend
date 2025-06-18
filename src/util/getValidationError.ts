import { ValidationError } from "yup";

interface IValidationErros {
  [key: string]: string;
}

export default function getValidationError(
  err: ValidationError,
): IValidationErros {
  const validationError: IValidationErros = {};

  err.inner.forEach(error => {
    validationError[error.path ? error.path : "key"] = error?.message;
  });

  return validationError;
}
