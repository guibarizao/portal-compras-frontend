import AppError from "../errors/AppError";
import IDashboardReport from "../interfaces/IDashboardReport";
import { useRequest } from "./useRequest";

const useDashboardsService = () => {
  const requestPurchaseRequestsTotal = useRequest<IDashboardReport>();
  const reports = "dashboards";

  const dashboardReports = async (
    initialDate: string,
    finalDate: string,
    email?: string
  ): Promise<IDashboardReport> => {
    return await requestPurchaseRequestsTotal
      .getOne({
        path: `${reports}?initialDate=${initialDate}&finalDate=${finalDate}`,
        sendAuthorization: true,
        body: { email },
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  return {
    dashboardReports,
  };
};

export { useDashboardsService };
