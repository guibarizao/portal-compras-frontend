import AppError from "../errors/AppError";
import IEvent from "../interfaces/IEvent";
import ISupplierEvent from "../interfaces/ISupplierEvent";
import { useRequest } from "./useRequest";

const useSupplierEventsService = () => {
  const supplierRequests = useRequest<ISupplierEvent>();
  const pathSupplier = "suppliers-events";

  const listSupplierEvents = async (supplierId: string): Promise<IEvent[]> => {
    const response = await supplierRequests
      .getMany({
        path: `${pathSupplier}/${supplierId}`,
        sendAuthorization: true,
      })
      .then((results) => {
        const list: IEvent[] = results.map((result) => {
          return {
            id: result.id ?? "",
            message: result.message ?? "",
            date: result.updated_at,
            erpStatusDescription:
              result.suppliersErpStatusId && result.suppliersErpStatusId > 0
                ? result.supplierErpStatus?.description
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
    listSupplierEvents,
  };
};

export { useSupplierEventsService };
