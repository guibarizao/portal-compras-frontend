import AppError from "../errors/AppError";

import IBranchOffice from "../interfaces/IBranchOffice";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import { useRequest } from "./useRequest";

const useBranchOfficeService = () => {
  const requestBranchesOffices = useRequest<IBranchOffice>();
  const pathBranchesOffices = "branches-offices";

  const createBranchOffice = async (
    category: IBranchOffice
  ): Promise<IBranchOffice> => {
    return await requestBranchesOffices
      .post({
        path: `${pathBranchesOffices}/`,
        sendAuthorization: true,
        body: category,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateBranchOffice = async (
    id: string,
    category: IBranchOffice
  ): Promise<IBranchOffice> => {
    return await requestBranchesOffices
      .put({
        path: `${pathBranchesOffices}/${id}`,
        sendAuthorization: true,
        body: category,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listBranchOfficeById = async (id: string): Promise<IBranchOffice> => {
    return await requestBranchesOffices
      .getOne({ path: `${pathBranchesOffices}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllBranchesOffices = async (
    queryParams: string
  ): Promise<IPaginationReturn<IBranchOffice[]>> => {
    const response = await requestBranchesOffices
      .getManyPaginated({
        path: `${pathBranchesOffices}?${queryParams}`,
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

  const deleteBranchOffice = async (id: string): Promise<void> => {
    await requestBranchesOffices
      .remove({ path: `${pathBranchesOffices}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  return {
    listBranchOfficeById,
    listAllBranchesOffices,
    createBranchOffice,
    updateBranchOffice,
    deleteBranchOffice,
  };
};

export { useBranchOfficeService };
