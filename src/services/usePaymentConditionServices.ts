import AppError from "../errors/AppError";

import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IPaymentCondition from "../interfaces/IPaymentCondition";
import { useRequest } from "./useRequest";

const usePaymentConditionService = () => {
  const requestPaymentConditions = useRequest<IPaymentCondition>();
  const pathPaymentConditions = "payment-conditions";

  const listAllPaymentConditions = async (
    queryParams: string
  ): Promise<IPaginationReturn<IPaymentCondition[]>> => {
    const response = await requestPaymentConditions
      .getManyPaginated({
        path: `${pathPaymentConditions}?${queryParams}`,
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

  const listPaymentConditionsDynamically = async (
    queryParams: string
  ): Promise<IPaginationReturn<IPaymentCondition[]>> => {
    return await requestPaymentConditions
      .getManyPaginated({
        path: `${pathPaymentConditions}/dynamically?${queryParams}`,
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
    listAllPaymentConditions,
    listPaymentConditionsDynamically,
  };
};

export { usePaymentConditionService };
