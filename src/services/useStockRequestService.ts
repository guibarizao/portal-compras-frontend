import AppError from "../errors/AppError";
import IGenerateStockRequestReportRequest from "../interfaces/IGenerateStockRequestReportRequest";
import IGenerateReportResponse from "../interfaces/IGenerateReportResponse";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IStockRequest from "../interfaces/IStockRequest";
import { useRequest } from "./useRequest";

const useStockRequestService = () => {
  const requestStockRequests = useRequest<IStockRequest>();
  const requestStockRequestReport = useRequest<IGenerateReportResponse>();
  const pathStockRequests = "stock-requests";

  const createStockRequest = async (
    stockRequest: IStockRequest
  ): Promise<IStockRequest> => {
    return await requestStockRequests
      .post({
        path: `${pathStockRequests}/`,
        sendAuthorization: true,
        body: stockRequest,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const generateStockRequestReport = async (
    stockRequestReport: IGenerateStockRequestReportRequest
  ): Promise<IGenerateReportResponse> => {
    return await requestStockRequestReport
      .post({
        path: `${pathStockRequests}/report`,
        sendAuthorization: true,
        body: stockRequestReport,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateStockRequest = async (
    id: string,
    stockRequest: IStockRequest
  ): Promise<IStockRequest> => {
    return await requestStockRequests
      .put({
        path: `${pathStockRequests}/${id}`,
        sendAuthorization: true,
        body: stockRequest,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const closeStockRequest = async (id: string): Promise<IStockRequest> => {
    return await requestStockRequests
      .patch({
        path: `${pathStockRequests}/close/${id}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listStockRequestById = async (id: string): Promise<IStockRequest> => {
    return await requestStockRequests
      .getOne({ path: `${pathStockRequests}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllStockRequests = async (
    queryParams: string
  ): Promise<IPaginationReturn<IStockRequest[]>> => {
    const response = await requestStockRequests
      .getManyPaginated({
        path: `${pathStockRequests}?${queryParams}`,
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

  const deleteStockRequest = async (id: string): Promise<void> => {
    await requestStockRequests
      .remove({ path: `${pathStockRequests}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  return {
    listStockRequestById,
    listAllStockRequests,
    createStockRequest,
    generateStockRequestReport,
    closeStockRequest,
    updateStockRequest,
    deleteStockRequest,
  };
};

export { useStockRequestService };
