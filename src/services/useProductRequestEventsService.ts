import AppError from "../errors/AppError";
import IEvent from "../interfaces/IEvent";
import IProductRequestEvent from "../interfaces/IProductRequestEvent";
import { useRequest } from "./useRequest";

const useProductRequestEventsService = () => {
  const productRequestRequests = useRequest<IProductRequestEvent>();
  const pathProductRequest = "product-request-events";

  const listProductRequestEvents = async (
    productRequestId: string
  ): Promise<IEvent[]> => {
    const response = await productRequestRequests
      .getMany({
        path: `${pathProductRequest}/${productRequestId}`,
        sendAuthorization: true,
      })
      .then((results) => {
        const list: IEvent[] = results.map((result) => {
          return {
            id: result.id ?? "",
            message: result.message ?? "",
            date: result.updated_at ?? new Date(),
            erpStatusId: result.productRequestErpStatusId ?? null,
            erpStatusDescription:
              result.productRequestErpStatus?.description ?? "",
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
    listProductRequestEvents,
  };
};

export { useProductRequestEventsService };
