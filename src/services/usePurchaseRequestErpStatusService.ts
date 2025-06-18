import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IPurchaseRequestErpStatus from "../interfaces/IPurchaseRequestErpStatus";
import { useRequest } from "./useRequest";

const usePurchaseRequestErpStatusService = () => {
  const requestPurchaseRequestErpStatus =
    useRequest<IPurchaseRequestErpStatus>();
  const pathPurchaseRequestErpStatus = "purchase-request-erp-status";

  const listAllPurchaseRequestErpStatus = async (
    queryParams: string
  ): Promise<IPaginationReturn<IPurchaseRequestErpStatus[]>> => {
    const response = await requestPurchaseRequestErpStatus
      .getManyPaginated({
        path: `${pathPurchaseRequestErpStatus}/dynamically?${queryParams}`,
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
    listAllPurchaseRequestErpStatus,
  };
};

export { usePurchaseRequestErpStatusService };
