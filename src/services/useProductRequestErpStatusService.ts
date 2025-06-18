import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IProductRequestErpStatus from "../interfaces/IProductRequestErpStatus";
import { useRequest } from "./useRequest";

const useProductRequestErpStatusService = () => {
  const requestProductRequestErpStatus = useRequest<IProductRequestErpStatus>();

  const pathProductRequestErpStatus = "product-request-erp-status";

  const listProductRequestErpStatusDynamically = async (
    queryParams: string
  ): Promise<IPaginationReturn<IProductRequestErpStatus[]>> => {
    return await requestProductRequestErpStatus
      .getManyPaginated({
        path: `${pathProductRequestErpStatus}/dynamically?${queryParams}`,
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
    listProductRequestErpStatusDynamically,
  };
};

export { useProductRequestErpStatusService };
