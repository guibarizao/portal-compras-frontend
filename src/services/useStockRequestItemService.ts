import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IStockRequestItem from "../interfaces/IStockRequestItem";
import { useRequest } from "./useRequest";

const useStockRequestItemService = () => {
  const requestStockRequestItems = useRequest<IStockRequestItem>();
  const pathStockRequestItems = "stock-request-items";

  const createStockRequestItem = async (
    stockRequestItems: IStockRequestItem
  ): Promise<IStockRequestItem> => {
    return await requestStockRequestItems
      .post({
        path: `${pathStockRequestItems}/`,
        sendAuthorization: true,
        body: stockRequestItems,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateStockRequestItem = async (
    id: string,
    stockRequestItems: IStockRequestItem
  ): Promise<IStockRequestItem> => {
    return await requestStockRequestItems
      .put({
        path: `${pathStockRequestItems}/${id}`,
        sendAuthorization: true,
        body: stockRequestItems,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listStockRequestItemById = async (
    id: string
  ): Promise<IStockRequestItem> => {
    return await requestStockRequestItems
      .getOne({
        path: `${pathStockRequestItems}/${id}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllStockRequestItems = async (
    stockRequestId: string,
    queryParams: string
  ): Promise<IPaginationReturn<IStockRequestItem[]>> => {
    const response = await requestStockRequestItems
      .getManyPaginated({
        path: `${pathStockRequestItems}/all/${stockRequestId}?${queryParams}`,
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

  const deleteStockRequestItem = async (id: string): Promise<void> => {
    await requestStockRequestItems
      .remove({
        path: `${pathStockRequestItems}/${id}`,
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
    listStockRequestItemById,
    listAllStockRequestItems,
    createStockRequestItem,
    updateStockRequestItem,
    deleteStockRequestItem,
  };
};

export { useStockRequestItemService };
