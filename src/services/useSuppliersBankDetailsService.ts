import AppError from "../errors/AppError";
import ISuppliersBankDetails from "../interfaces/ISuppliersBankDetails";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import { useRequest } from "./useRequest";

const useSuppliersBankDetailsService = () => {
  const requestSuppliersBankDetails = useRequest<ISuppliersBankDetails>();
  const pathSuppliersBankDetails = "suppliers-bank-details";

  const createSuppliersBankDetails = async (
    suppliersBankDetails: ISuppliersBankDetails
  ): Promise<ISuppliersBankDetails> => {
    return await requestSuppliersBankDetails
      .post({
        path: `${pathSuppliersBankDetails}/`,
        sendAuthorization: true,
        body: suppliersBankDetails,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateSuppliersBankDetails = async (
    id: string,
    suppliersBankDetails: ISuppliersBankDetails
  ): Promise<ISuppliersBankDetails> => {
    return await requestSuppliersBankDetails
      .put({
        path: `${pathSuppliersBankDetails}/${id}`,
        sendAuthorization: true,
        body: suppliersBankDetails,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listSuppliersBankDetailsById = async (
    id: string
  ): Promise<ISuppliersBankDetails> => {
    return await requestSuppliersBankDetails
      .getOne({
        path: `${pathSuppliersBankDetails}/${id}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listSuppliersBankDetailsBySupplierId = async (
    id: string
  ): Promise<ISuppliersBankDetails[]> => {
    return await requestSuppliersBankDetails
      .getMany({
        path: `${pathSuppliersBankDetails}/supplier/${id}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllSuppliersBankDetails = async (
    id: string,
    queryParams: string
  ): Promise<IPaginationReturn<ISuppliersBankDetails[]>> => {
    const response = await requestSuppliersBankDetails
      .getManyPaginated({
        path: `${pathSuppliersBankDetails}/all/${id}?${queryParams}`,
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

  const deleteSuppliersBankDetails = async (id: string): Promise<void> => {
    await requestSuppliersBankDetails
      .remove({
        path: `${pathSuppliersBankDetails}/${id}`,
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
    listSuppliersBankDetailsById,
    listAllSuppliersBankDetails,
    createSuppliersBankDetails,
    updateSuppliersBankDetails,
    deleteSuppliersBankDetails,
    listSuppliersBankDetailsBySupplierId,
  };
};

export { useSuppliersBankDetailsService };
