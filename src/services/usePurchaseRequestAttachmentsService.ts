import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IPurchaseRequestAttachment from "../interfaces/IPurchaseRequestAttachment";
import { useRequest } from "./useRequest";

const usePurchaseRequestAttachmentService = () => {
  const requestPurchaseRequestAttachments =
    useRequest<IPurchaseRequestAttachment>();
  const pathPurchaseRequestAttachments = "purchase-request-attachments";

  const uploadPurchaseRequestAttachment = async (
    purchaseRequestId: string,
    data: FormData
  ): Promise<IPurchaseRequestAttachment> => {
    const response = await requestPurchaseRequestAttachments
      .patch({
        path: `${pathPurchaseRequestAttachments}/${purchaseRequestId}`,
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

  const listAllPurchaseRequestAttachments = async (
    purchaseRequestId: string,
    queryParams: string
  ): Promise<IPaginationReturn<IPurchaseRequestAttachment[]>> => {
    const response = await requestPurchaseRequestAttachments
      .getManyPaginated({
        path: `${pathPurchaseRequestAttachments}/${purchaseRequestId}?${queryParams}`,
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

  const deletePurchaseRequestAttachment = async (id: string): Promise<void> => {
    await requestPurchaseRequestAttachments
      .remove({
        path: `${pathPurchaseRequestAttachments}/${id}`,
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
    uploadPurchaseRequestAttachment,
    listAllPurchaseRequestAttachments,
    deletePurchaseRequestAttachment,
  };
};

export { usePurchaseRequestAttachmentService };
