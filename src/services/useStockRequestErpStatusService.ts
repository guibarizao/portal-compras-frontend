import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IStockRequestErpStatus from "../interfaces/IStockRequestErpStatus";
import { useRequest } from "./useRequest";

const useStockRequestErpStatusService = () => {
  const requestStockRequestErpStatus = useRequest<IStockRequestErpStatus>();
  const pathStockRequestErpStatus = "stock-request-erp-status";

  const listAllStockRequestErpStatus = async (
    queryParams: string
  ): Promise<IPaginationReturn<IStockRequestErpStatus[]>> => {
    const response = await requestStockRequestErpStatus
      .getManyPaginated({
        path: `${pathStockRequestErpStatus}/dynamically?${queryParams}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.mesage);
      });

    return response;
  };

  return {
    listAllStockRequestErpStatus,
  };
};

export { useStockRequestErpStatusService };
