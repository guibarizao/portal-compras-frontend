import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import ISupplierErpStatus from "../interfaces/ISupplierErpStatus";
import { useRequest } from "./useRequest";

const useSupplierErpStatusService = () => {
  const requestSupplierErpStatus = useRequest<ISupplierErpStatus>();

  const pathSupplierErpStatus = "suppliers-erp-status";

  const listSupplierErpStatusDynamically = async (
    queryParams: string
  ): Promise<IPaginationReturn<ISupplierErpStatus[]>> => {
    return await requestSupplierErpStatus
      .getManyPaginated({
        path: `${pathSupplierErpStatus}/dynamically?${queryParams}`,
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
    listSupplierErpStatusDynamically,
  };
};

export { useSupplierErpStatusService };
