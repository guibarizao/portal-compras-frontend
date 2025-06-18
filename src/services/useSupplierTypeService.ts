import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import ISupplierType from "../interfaces/ISupplierType";
import { useRequest } from "./useRequest";

const useSupplierTypeService = () => {
  const requestSupplierTypes = useRequest<ISupplierType>();
  const pathSupplierTypes = "supplier-type";

  const createSupplierType = async (
    supplierType: ISupplierType
  ): Promise<ISupplierType> => {
    return await requestSupplierTypes
      .post({
        path: `${pathSupplierTypes}/`,
        sendAuthorization: true,
        body: supplierType,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateSupplierType = async (
    id: number,
    supplierType: ISupplierType
  ): Promise<ISupplierType> => {
    return await requestSupplierTypes
      .put({
        path: `${pathSupplierTypes}/${id}`,
        sendAuthorization: true,
        body: supplierType,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listSupplierTypeById = async (id: number): Promise<ISupplierType> => {
    return await requestSupplierTypes
      .getOne({
        path: `${pathSupplierTypes}/${id}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllSupplierTypes = async (
    queryParams: string
  ): Promise<IPaginationReturn<ISupplierType[]>> => {
    const response = await requestSupplierTypes
      .getManyPaginated({
        path: `${pathSupplierTypes}?${queryParams}`,
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

  const deleteSupplierType = async (id: number): Promise<void> => {
    await requestSupplierTypes
      .remove({
        path: `${pathSupplierTypes}/${id}`,
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
    listSupplierTypeById,
    listAllSupplierTypes,
    createSupplierType,
    updateSupplierType,
    deleteSupplierType,
  };
};

export { useSupplierTypeService };
