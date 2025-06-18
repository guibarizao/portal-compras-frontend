import AppError from "../errors/AppError";

import ICostCenter from "../interfaces/ICostCenter";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import { useRequest } from "./useRequest";

const useCostCenterService = () => {
  const requestCostCenters = useRequest<ICostCenter>();
  const pathCostCenters = "cost-centers";

  const createCostCenter = async (
    costCenter: ICostCenter
  ): Promise<ICostCenter> => {
    return await requestCostCenters
      .post({
        path: `${pathCostCenters}/`,
        sendAuthorization: true,
        body: costCenter,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateCostCenter = async (
    id: string,
    costCenter: ICostCenter
  ): Promise<ICostCenter> => {
    return await requestCostCenters
      .put({
        path: `${pathCostCenters}/${id}`,
        sendAuthorization: true,
        body: costCenter,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listCostCenterById = async (id: string): Promise<ICostCenter> => {
    return await requestCostCenters
      .getOne({ path: `${pathCostCenters}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllCostCenters = async (
    queryParams: string
  ): Promise<IPaginationReturn<ICostCenter[]>> => {
    const response = await requestCostCenters
      .getManyPaginated({
        path: `${pathCostCenters}?${queryParams}`,
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

  const listCostCentersDynamically = async (
    queryParams: string
  ): Promise<IPaginationReturn<ICostCenter[]>> => {
    return await requestCostCenters
      .getManyPaginated({
        path: `${pathCostCenters}/dynamically?${queryParams}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message);
      });
  };

  const deleteCostCenter = async (id: string): Promise<void> => {
    await requestCostCenters
      .remove({ path: `${pathCostCenters}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  return {
    listCostCenterById,
    listAllCostCenters,
    listCostCentersDynamically,
    createCostCenter,
    updateCostCenter,
    deleteCostCenter,
  };
};

export { useCostCenterService };
