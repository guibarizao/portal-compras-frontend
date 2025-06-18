import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IPurchaseRequestType from "../interfaces/IPurchaseRequestType";
import { useRequest } from "./useRequest";

const usePurchaseRequestTypeService = () => {
  const requestPurchaseRequestTypes = useRequest<IPurchaseRequestType>();
  const pathPurchaseRequestTypes = "purchase-request-types";

  const createPurchaseRequestType = async (
    purchaseRequestType: IPurchaseRequestType
  ): Promise<IPurchaseRequestType> => {
    return await requestPurchaseRequestTypes
      .post({
        path: `${pathPurchaseRequestTypes}/`,
        sendAuthorization: true,
        body: purchaseRequestType,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updatePurchaseRequestType = async (
    id: string,
    purchaseRequestType: IPurchaseRequestType
  ): Promise<IPurchaseRequestType> => {
    return await requestPurchaseRequestTypes
      .put({
        path: `${pathPurchaseRequestTypes}/${id}`,
        sendAuthorization: true,
        body: purchaseRequestType,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listPurchaseRequestTypeById = async (
    id: string
  ): Promise<IPurchaseRequestType> => {
    return await requestPurchaseRequestTypes
      .getOne({
        path: `${pathPurchaseRequestTypes}/${id}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllPurchaseRequestTypes = async (
    queryParams: string
  ): Promise<IPaginationReturn<IPurchaseRequestType[]>> => {
    const response = await requestPurchaseRequestTypes
      .getManyPaginated({
        path: `${pathPurchaseRequestTypes}?${queryParams}`,
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

  const deletePurchaseRequestType = async (id: string): Promise<void> => {
    await requestPurchaseRequestTypes
      .remove({
        path: `${pathPurchaseRequestTypes}/${id}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  return {
    listPurchaseRequestTypeById,
    listAllPurchaseRequestTypes,
    createPurchaseRequestType,
    updatePurchaseRequestType,
    deletePurchaseRequestType,
  };
};

export { usePurchaseRequestTypeService };
