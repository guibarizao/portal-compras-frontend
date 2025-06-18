import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IPurchaseRequestItem from "../interfaces/IPurchaseRequestItem";
import { useRequest } from "./useRequest";

interface ITotalValue {
  totalValue: number;
}

const usePurchaseRequestItemService = () => {
  const requestPurchaseRequestItems = useRequest<IPurchaseRequestItem>();
  const requestPurchaseRequestItemsTotal = useRequest<ITotalValue>();
  const pathPurchaseRequestItems = "purchase-request-items";

  const createPurchaseRequestItem = async (
    purchaseRequestItems: IPurchaseRequestItem
  ): Promise<IPurchaseRequestItem> => {
    return await requestPurchaseRequestItems
      .post({
        path: `${pathPurchaseRequestItems}/`,
        sendAuthorization: true,
        body: purchaseRequestItems,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updatePurchaseRequestItem = async (
    id: string,
    purchaseRequestItems: IPurchaseRequestItem
  ): Promise<IPurchaseRequestItem> => {
    return await requestPurchaseRequestItems
      .put({
        path: `${pathPurchaseRequestItems}/${id}`,
        sendAuthorization: true,
        body: purchaseRequestItems,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listPurchaseRequestItemById = async (
    id: string
  ): Promise<IPurchaseRequestItem> => {
    return await requestPurchaseRequestItems
      .getOne({
        path: `${pathPurchaseRequestItems}/${id}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllPurchaseRequestItems = async (
    purchaseRequestId: string,
    queryParams: string
  ): Promise<IPaginationReturn<IPurchaseRequestItem[]>> => {
    const response = await requestPurchaseRequestItems
      .getManyPaginated({
        path: `${pathPurchaseRequestItems}/all/${purchaseRequestId}?${queryParams}`,
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

  const deletePurchaseRequestItem = async (id: string): Promise<void> => {
    await requestPurchaseRequestItems
      .remove({
        path: `${pathPurchaseRequestItems}/${id}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listTotalValueByPurchaseRequestId = async (
    purchaseRequestId: string
  ): Promise<ITotalValue> => {
    const response = await requestPurchaseRequestItemsTotal
      .getOne({
        path: `${pathPurchaseRequestItems}/total/${purchaseRequestId}`,
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

  return {
    listPurchaseRequestItemById,
    listAllPurchaseRequestItems,
    createPurchaseRequestItem,
    updatePurchaseRequestItem,
    deletePurchaseRequestItem,
    listTotalValueByPurchaseRequestId,
  };
};

export { usePurchaseRequestItemService };
