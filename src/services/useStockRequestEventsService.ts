import AppError from "../errors/AppError";
import IEvent from "../interfaces/IEvent";
import IStockRequestEvent from "../interfaces/IStockRequestEvent";
import { useRequest } from "./useRequest";

const useStockRequestEventsService = () => {
  const requestStockRequests = useRequest<IStockRequestEvent>();
  const pathStockRequests = "stock-requests";

  const listStockRequestsEventsById = async (
    stockRequestId: string
  ): Promise<IEvent[]> => {
    const response = await requestStockRequests
      .getMany({
        path: `${pathStockRequests}/events/${stockRequestId}`,
        sendAuthorization: true,
      })
      .then((results) => {
        const list: IEvent[] = results.map((result) => {
          return {
            id: result.id ?? "",
            message: result.message ?? "",
            date: result.updated_at,
            erpStatusDescription:
              result.stockRequestErpStatusId &&
              result.stockRequestErpStatusId > 0
                ? result.stockRequestErpStatus?.description
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
    listStockRequestsEventsById,
  };
};

export { useStockRequestEventsService };
