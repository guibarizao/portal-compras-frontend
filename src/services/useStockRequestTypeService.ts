import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IStockRequestType from "../interfaces/IStockRequestType";
import { useRequest } from "./useRequest";

const useStockRequestTypeService = () => {
  const requestStockRequestTypes = useRequest<IStockRequestType>();
  const pathStockRequestTypes = "stock-request-types";

  const createStockRequestType = async (
    stockRequestType: IStockRequestType
  ): Promise<IStockRequestType> => {
    return await requestStockRequestTypes
      .post({
        path: `${pathStockRequestTypes}/`,
        sendAuthorization: true,
        body: stockRequestType,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateStockRequestType = async (
    id: string,
    stockRequestType: IStockRequestType
  ): Promise<IStockRequestType> => {
    return await requestStockRequestTypes
      .put({
        path: `${pathStockRequestTypes}/${id}`,
        sendAuthorization: true,
        body: stockRequestType,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listStockRequestTypeById = async (
    id: string
  ): Promise<IStockRequestType> => {
    return await requestStockRequestTypes
      .getOne({
        path: `${pathStockRequestTypes}/${id}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllStockRequestTypes = async (
    queryParams: string
  ): Promise<IPaginationReturn<IStockRequestType[]>> => {
    const response = await requestStockRequestTypes
      .getManyPaginated({
        path: `${pathStockRequestTypes}?${queryParams}`,
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

  const deleteStockRequestType = async (id: string): Promise<void> => {
    await requestStockRequestTypes
      .remove({
        path: `${pathStockRequestTypes}/${id}`,
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
    listStockRequestTypeById,
    listAllStockRequestTypes,
    createStockRequestType,
    updateStockRequestType,
    deleteStockRequestType,
  };
};

export { useStockRequestTypeService };
