import AppError from "../errors/AppError";

import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IPaymentForm from "../interfaces/IPaymentForm";
import { useRequest } from "./useRequest";

const usePaymentFormService = () => {
  const requestPaymentForms = useRequest<IPaymentForm>();
  const pathPaymentForms = "payment-forms";

  const listAllPaymentForms = async (
    queryParams: string
  ): Promise<IPaginationReturn<IPaymentForm[]>> => {
    const response = await requestPaymentForms
      .getManyPaginated({
        path: `${pathPaymentForms}?${queryParams}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message);
      });

    return response;
  };

  const listPaymentFormsDynamically = async (
    queryParams: string
  ): Promise<IPaginationReturn<IPaymentForm[]>> => {
    return await requestPaymentForms
      .getManyPaginated({
        path: `${pathPaymentForms}/dynamically?${queryParams}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message);
      });
  };

  return {
    listAllPaymentForms,
    listPaymentFormsDynamically,
  };
};

export { usePaymentFormService };
