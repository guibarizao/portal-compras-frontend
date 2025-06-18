import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IProductRequestsAttachment from "../interfaces/IProductRequestsAttachment";
import { useRequest } from "./useRequest";

const useProductRequestsAttachmentService = () => {
  const requestProductRequestsAttachments =
    useRequest<IProductRequestsAttachment>();
  const pathProductRequestsAttachments = "product-requests-attachments";

  const uploadProductRequestsAttachment = async (
    productRequestId: string,
    data: FormData
  ): Promise<IProductRequestsAttachment> => {
    const response = await requestProductRequestsAttachments
      .patch({
        path: `${pathProductRequestsAttachments}/${productRequestId}`,
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

  const updateProductRequestsAttachment = async (
    productRequestAttachmentId: string,
    data: FormData
  ): Promise<IProductRequestsAttachment> => {
    const response = await requestProductRequestsAttachments
      .patch({
        path: `${pathProductRequestsAttachments}/update/${productRequestAttachmentId}`,
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

  const listAllProductRequestsAttachments = async (
    productRequestsId: string,
    queryParams: string
  ): Promise<IPaginationReturn<IProductRequestsAttachment[]>> => {
    const response = await requestProductRequestsAttachments
      .getManyPaginated({
        path: `${pathProductRequestsAttachments}/${productRequestsId}?${queryParams}`,
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

  const deleteProductRequestsAttachment = async (id: string): Promise<void> => {
    await requestProductRequestsAttachments
      .remove({
        path: `${pathProductRequestsAttachments}/${id}`,
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
    uploadProductRequestsAttachment,
    listAllProductRequestsAttachments,
    deleteProductRequestsAttachment,
    updateProductRequestsAttachment,
  };
};

export { useProductRequestsAttachmentService };
