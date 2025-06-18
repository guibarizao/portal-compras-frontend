import AppError from "../errors/AppError";
import IGeneratePurchaseRequestReportRequest from "../interfaces/IGeneratePurchaseRequestReportRequest";
import IGenerateReportResponse from "../interfaces/IGenerateReportResponse";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IPurchaseRequest from "../interfaces/IPurchaseRequest";
import { useRequest } from "./useRequest";

const usePurchaseRequestService = () => {
  const requestPurchaseRequests = useRequest<IPurchaseRequest>();
  const requestPurchaseRequestReport = useRequest<IGenerateReportResponse>();
  const pathPurchaseRequests = "purchase-requests";

  const createPurchaseRequest = async (
    purchaseRequest: IPurchaseRequest
  ): Promise<IPurchaseRequest> => {
    return await requestPurchaseRequests
      .post({
        path: `${pathPurchaseRequests}/`,
        sendAuthorization: true,
        body: purchaseRequest,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const generatePurchaseRequestReport = async (
    stockRequestReport: IGeneratePurchaseRequestReportRequest
  ): Promise<IGenerateReportResponse> => {
    return await requestPurchaseRequestReport
      .post({
        path: `${pathPurchaseRequests}/report`,
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

  const updatePurchaseRequest = async (
    id: string,
    purchaseRequest: IPurchaseRequest
  ): Promise<IPurchaseRequest> => {
    return await requestPurchaseRequests
      .put({
        path: `${pathPurchaseRequests}/${id}`,
        sendAuthorization: true,
        body: purchaseRequest,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const closePurchaseRequest = async (
    id: string
  ): Promise<IPurchaseRequest> => {
    return await requestPurchaseRequests
      .patch({
        path: `${pathPurchaseRequests}/close/${id}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listPurchaseRequestById = async (
    id: string
  ): Promise<IPurchaseRequest> => {
    return await requestPurchaseRequests
      .getOne({
        path: `${pathPurchaseRequests}/${id}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllPurchaseRequests = async (
    queryParams: string
  ): Promise<IPaginationReturn<IPurchaseRequest[]>> => {
    const response = await requestPurchaseRequests
      .getManyPaginated({
        path: `${pathPurchaseRequests}?${queryParams}`,
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

  const deletePurchaseRequest = async (id: string): Promise<void> => {
    await requestPurchaseRequests
      .remove({
        path: `${pathPurchaseRequests}/${id}`,
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
    listPurchaseRequestById,
    listAllPurchaseRequests,
    // listPurchaseRequestTotalByPeriodAndUserEmail,
    createPurchaseRequest,
    closePurchaseRequest,
    updatePurchaseRequest,
    deletePurchaseRequest,
    generatePurchaseRequestReport,
  };
};

export { usePurchaseRequestService };
