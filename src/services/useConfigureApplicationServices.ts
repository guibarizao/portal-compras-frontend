import AppError from "../errors/AppError";
import { IConfigureApplication } from "../interfaces/IConfigureApplication";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IURL from "../interfaces/IURL";
import { useRequest } from "./useRequest";

const useConfigureApplicationService = () => {
  const requestConfigureApplications = useRequest<IConfigureApplication>();
  const requestConfigureApplicationsURL = useRequest<IURL>();
  const pathConfigureApplications = "configure-applications";

  const createConfigureApplication = async (
    configureApplication: IConfigureApplication
  ): Promise<IConfigureApplication> => {
    return await requestConfigureApplications
      .post({
        path: `${pathConfigureApplications}/`,
        sendAuthorization: true,
        body: configureApplication,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateConfigureApplication = async (
    id: string,
    configureApplication: IConfigureApplication
  ): Promise<IConfigureApplication> => {
    return await requestConfigureApplications
      .put({
        path: `${pathConfigureApplications}/${id}`,
        sendAuthorization: true,
        body: configureApplication,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listConfigureApplicationById = async (
    id: string
  ): Promise<IConfigureApplication> => {
    return await requestConfigureApplications
      .getOne({
        path: `${pathConfigureApplications}/${id}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listConfigureApplicationURLByName = async (
    name: string
  ): Promise<IURL> => {
    return await requestConfigureApplicationsURL
      .getOne({
        path: `${pathConfigureApplications}/by-name?name${name}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllConfigureApplications = async (
    queryParams: string
  ): Promise<IPaginationReturn<IConfigureApplication[]>> => {
    const response = await requestConfigureApplications
      .getManyPaginated({
        path: `${pathConfigureApplications}?${queryParams}`,
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

  const deleteConfigureApplication = async (id: string): Promise<void> => {
    await requestConfigureApplications
      .remove({
        path: `${pathConfigureApplications}/${id}`,
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
    listConfigureApplicationById,
    listAllConfigureApplications,
    createConfigureApplication,
    updateConfigureApplication,
    deleteConfigureApplication,
    listConfigureApplicationURLByName,
  };
};

export { useConfigureApplicationService };
