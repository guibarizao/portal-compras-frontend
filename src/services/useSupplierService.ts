import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import ISupplier from "../interfaces/ISupplier";
import { useRequest } from "./useRequest";

export interface IConditionSuppliers {
  isActive?: boolean | null;
}

const useSupplierService = () => {
  const requestSuppliers = useRequest<ISupplier>();
  const requestSupplierReport = useRequest<{ file: string }>();
  const pathSuppliers = "suppliers";

  const createSupplier = async (supplier: ISupplier): Promise<ISupplier> => {
    return await requestSuppliers
      .post({
        path: `${pathSuppliers}/`,
        sendAuthorization: true,
        body: supplier,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateSupplier = async (
    id: string,
    supplier: ISupplier
  ): Promise<ISupplier> => {
    return await requestSuppliers
      .put({
        path: `${pathSuppliers}/${id}`,
        sendAuthorization: true,
        body: supplier,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listSupplierById = async (id: string): Promise<ISupplier> => {
    return await requestSuppliers
      .getOne({ path: `${pathSuppliers}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllSuppliers = async (
    queryParams: string
  ): Promise<IPaginationReturn<ISupplier[]>> => {
    const response = await requestSuppliers
      .getManyPaginated({
        path: `${pathSuppliers}?${queryParams}`,
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

  const listSuppliersDynamically = async (
    queryParams: string,
    condition?: IConditionSuppliers
  ): Promise<IPaginationReturn<ISupplier[]>> => {
    return await requestSuppliers
      .postAndGetManyPaginated({
        path: `${pathSuppliers}/dynamically?${queryParams}`,
        sendAuthorization: true,
        body: { condition },
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message);
      });
  };

  const generateSupplierReport = async (
    supplierId: string
  ): Promise<{ file: string }> => {
    return await requestSupplierReport
      .post({
        path: `${pathSuppliers}/report`,
        sendAuthorization: true,
        body: { supplierId },
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const deleteSupplier = async (id: string): Promise<void> => {
    await requestSuppliers
      .remove({ path: `${pathSuppliers}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const closeSupplier = async (id: string): Promise<ISupplier> => {
    return await requestSuppliers
      .patch({
        path: `${pathSuppliers}/close/${id}`,
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
    listSupplierById,
    listAllSuppliers,
    listSuppliersDynamically,
    createSupplier,
    updateSupplier,
    generateSupplierReport,
    deleteSupplier,
    closeSupplier,
  };
};

export { useSupplierService };
