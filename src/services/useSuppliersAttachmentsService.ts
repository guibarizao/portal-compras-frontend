import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import ISuppliersAttachment from "../interfaces/ISuppliersAttachment";
import { useRequest } from "./useRequest";

const useSuppliersAttachmentService = () => {
  const requestSuppliersAttachments = useRequest<ISuppliersAttachment>();
  const pathSuppliersAttachments = "suppliers-attachments";

  const uploadSuppliersAttachment = async (
    suppliersId: string,
    data: FormData
  ): Promise<ISuppliersAttachment> => {
    const response = await requestSuppliersAttachments
      .patch({
        path: `${pathSuppliersAttachments}/${suppliersId}`,
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

  const updateSuppliersAttachment = async (
    supplierAttachmentId: string,
    data: FormData
  ): Promise<ISuppliersAttachment> => {
    const response = await requestSuppliersAttachments
      .patch({
        path: `${pathSuppliersAttachments}/update/${supplierAttachmentId}`,
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

  const listAllSuppliersAttachments = async (
    suppliersId: string,
    queryParams: string
  ): Promise<IPaginationReturn<ISuppliersAttachment[]>> => {
    const response = await requestSuppliersAttachments
      .getManyPaginated({
        path: `${pathSuppliersAttachments}/${suppliersId}?${queryParams}`,
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

  const deleteSuppliersAttachment = async (id: string): Promise<void> => {
    await requestSuppliersAttachments
      .remove({
        path: `${pathSuppliersAttachments}/${id}`,
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
    uploadSuppliersAttachment,
    listAllSuppliersAttachments,
    deleteSuppliersAttachment,
    updateSuppliersAttachment,
  };
};

export { useSuppliersAttachmentService };
