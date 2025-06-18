import AppError from "../errors/AppError";
import IPurchaseRequestMessage from "../interfaces/IPurchaseRequestMessage";
import IPurchaseRequestMessageAttachment from "../interfaces/IPurchaseRequestMessageAttachment";
import { useRequest } from "./useRequest";

const usePurchaseRequestMessagesService = () => {
  const requestPurchaseRequestMessage = useRequest<IPurchaseRequestMessage>();
  const requestPurchaseRequestMessageAttachment =
    useRequest<IPurchaseRequestMessageAttachment>();
  const pathPurchaseRequestMessage = "purchase-request-messages";

  const uploadPurchaseRequestMessageAttachment = async (
    purchaseRequestMessageId: string,
    data: FormData
  ): Promise<IPurchaseRequestMessageAttachment> => {
    const response = await requestPurchaseRequestMessageAttachment
      .patch({
        path: `${pathPurchaseRequestMessage}/attachment/${purchaseRequestMessageId}`,
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

  const listPurchaseRequestMessages = async (
    purchaseRequestId: string
  ): Promise<IPurchaseRequestMessage[]> => {
    const response = await requestPurchaseRequestMessage
      .getMany({
        path: `${pathPurchaseRequestMessage}/all/${purchaseRequestId}`,
        sendAuthorization: true,
      })
      .then((results) => {
        return results;
      })
      .catch((error) => {
        throw new AppError(error.message);
      });

    return response;
  };

  const updatePurchaseRequestMessage = async (
    purchaseRequestMessageId: string,
    returnObservation: string
  ): Promise<void> => {
    await requestPurchaseRequestMessage
      .put({
        path: `${pathPurchaseRequestMessage}/${purchaseRequestMessageId}`,
        sendAuthorization: true,
        body: { returnObservation },
      })
      .then((results) => {
        return results;
      })
      .catch((error) => {
        throw new AppError(error.message);
      });

    return;
  };

  return {
    uploadPurchaseRequestMessageAttachment,
    listPurchaseRequestMessages,
    updatePurchaseRequestMessage,
  };
};

export { usePurchaseRequestMessagesService };
