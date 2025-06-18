import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IStockRequestAttachment from "../interfaces/IStockRequestAttachment";
import { useRequest } from "./useRequest";

const useStockRequestAttachmentService = () => {
  const requestStockRequestAttachments = useRequest<IStockRequestAttachment>();
  const pathStockRequestAttachments = "stock-request-attachments";

  const uploadStockRequestAttachment = async (
    stockRequestId: string,
    data: FormData
  ): Promise<IStockRequestAttachment> => {
    const response = await requestStockRequestAttachments
      .patch({
        path: `${pathStockRequestAttachments}/${stockRequestId}`,
        sendAuthorization: true,
        body: data,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message);
      });

    return response;
  };

  const listAllStockRequestAttachments = async (
    stockRequestId: string,
    queryParams: string
  ): Promise<IPaginationReturn<IStockRequestAttachment[]>> => {
    const response = await requestStockRequestAttachments
      .getManyPaginated({
        path: `${pathStockRequestAttachments}/${stockRequestId}?${queryParams}`,
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

  const deleteStockRequestAttachment = async (id: string): Promise<void> => {
    await requestStockRequestAttachments
      .remove({
        path: `${pathStockRequestAttachments}/${id}`,
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
    uploadStockRequestAttachment,
    listAllStockRequestAttachments,
    deleteStockRequestAttachment,
  };
};

export { useStockRequestAttachmentService };
