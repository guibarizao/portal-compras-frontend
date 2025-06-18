import AppError from "../errors/AppError";
import IEvent from "../interfaces/IEvent";
import IPurchaseEvent from "../interfaces/IPurchaseRequestEvent";
import { useRequest } from "./useRequest";

const usePurchaseRequestEventsService = () => {
  const requestStockRequests = useRequest<IPurchaseEvent>();
  const pathStockRequests = "purchase-requests";

  const listPurchaseRequestEvents = async (
    purchaseRequestId: string
  ): Promise<IEvent[]> => {
    const response = await requestStockRequests
      .getMany({
        path: `${pathStockRequests}/events/${purchaseRequestId}`,
        sendAuthorization: true,
      })
      .then((results) => {
        const list: IEvent[] = results.map((result) => {
          return {
            id: result.id ?? "",
            message: result.message ?? "",
            date: result.updated_at,
            erpStatusDescription:
              result.purchaseRequestErpStatusId &&
              result.purchaseRequestErpStatusId > 0
                ? result.purchaseRequestErpStatus?.description
                : "Nenhum status informado",
          };
        });

        return list;
      })
      .catch((error) => {
        throw new AppError(error.message);
      });

    return response;
  };

  return {
    listPurchaseRequestEvents,
  };
};

export { usePurchaseRequestEventsService };
