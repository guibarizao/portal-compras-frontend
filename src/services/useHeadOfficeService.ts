import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IHeadOffice from "../interfaces/IHeadOffice";
import { useRequest } from "./useRequest";

const useHeadOfficeService = () => {
  const requestHeadOffices = useRequest<IHeadOffice>();
  const pathHeadOffices = "head-offices";

  const createHeadOffice = async (
    headOffice: IHeadOffice
  ): Promise<IHeadOffice> => {
    return await requestHeadOffices
      .post({
        path: `${pathHeadOffices}/`,
        sendAuthorization: true,
        body: headOffice,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateHeadOffice = async (
    id: string,
    headOffice: IHeadOffice
  ): Promise<IHeadOffice> => {
    return await requestHeadOffices
      .put({
        path: `${pathHeadOffices}/${id}`,
        sendAuthorization: true,
        body: headOffice,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listHeadOfficeById = async (id: string): Promise<IHeadOffice> => {
    return await requestHeadOffices
      .getOne({ path: `${pathHeadOffices}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllHeadOffices = async (
    queryParams: string
  ): Promise<IPaginationReturn<IHeadOffice[]>> => {
    const response = await requestHeadOffices
      .getManyPaginated({
        path: `${pathHeadOffices}?${queryParams}`,
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

  const deleteHeadOffice = async (id: string): Promise<void> => {
    await requestHeadOffices
      .remove({ path: `${pathHeadOffices}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  return {
    listHeadOfficeById,
    listAllHeadOffices,
    createHeadOffice,
    updateHeadOffice,
    deleteHeadOffice,
  };
};

export { useHeadOfficeService };
