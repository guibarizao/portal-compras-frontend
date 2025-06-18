import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IPurchaseRequestReason from "../interfaces/IPurchaseRequestReason";
import { useRequest } from "./useRequest";

const usePurchaseRequestReasonService = () => {
  const requestPurchaseRequestReasons = useRequest<IPurchaseRequestReason>();
  const pathPurchaseRequestReasons = "purchase-request-reasons";

  const createPurchaseRequestReason = async (
    purchaseRequestReason: IPurchaseRequestReason
  ): Promise<IPurchaseRequestReason> => {
    return await requestPurchaseRequestReasons
      .post({
        path: `${pathPurchaseRequestReasons}/`,
        sendAuthorization: true,
        body: purchaseRequestReason,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updatePurchaseRequestReason = async (
    id: string,
    purchaseRequestReason: IPurchaseRequestReason
  ): Promise<IPurchaseRequestReason> => {
    return await requestPurchaseRequestReasons
      .put({
        path: `${pathPurchaseRequestReasons}/${id}`,
        sendAuthorization: true,
        body: purchaseRequestReason,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listPurchaseRequestReasonById = async (
    id: string
  ): Promise<IPurchaseRequestReason> => {
    return await requestPurchaseRequestReasons
      .getOne({
        path: `${pathPurchaseRequestReasons}/${id}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllPurchaseRequestReasons = async (
    queryParams: string
  ): Promise<IPaginationReturn<IPurchaseRequestReason[]>> => {
    const response = await requestPurchaseRequestReasons
      .getManyPaginated({
        path: `${pathPurchaseRequestReasons}?${queryParams}`,
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

  const deletePurchaseRequestReason = async (id: string): Promise<void> => {
    await requestPurchaseRequestReasons
      .remove({
        path: `${pathPurchaseRequestReasons}/${id}`,
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
    listPurchaseRequestReasonById,
    listAllPurchaseRequestReasons,
    createPurchaseRequestReason,
    updatePurchaseRequestReason,
    deletePurchaseRequestReason,
  };
};

export { usePurchaseRequestReasonService };
