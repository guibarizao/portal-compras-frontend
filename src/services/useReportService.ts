import AppError from "../errors/AppError";
import IERPGenerateReportResponse from "../interfaces/IERPGenerateReportResponse";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IReport from "../interfaces/IReport";
import { useRequest } from "./useRequest";

export interface IConditionReports {
  isActive?: boolean | null;
}

const useReportService = () => {
  const requestReports = useRequest<IReport>();
  const requestReportGenerate = useRequest<IERPGenerateReportResponse>();
  const pathReports = "reports";

  const createReport = async (report: IReport): Promise<IReport> => {
    return await requestReports
      .post({
        path: `${pathReports}/`,
        sendAuthorization: true,
        body: report,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateReport = async (
    id: string,
    report: IReport
  ): Promise<IReport> => {
    return await requestReports
      .put({
        path: `${pathReports}/${id}`,
        sendAuthorization: true,
        body: report,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listReportById = async (id: string): Promise<IReport> => {
    return await requestReports
      .getOne({ path: `${pathReports}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllReports = async (
    queryParams: string
  ): Promise<IPaginationReturn<IReport[]>> => {
    const response = await requestReports
      .getManyPaginated({
        path: `${pathReports}?${queryParams}`,
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

  const listReportsDynamically = async (
    queryParams: string,
    condition?: IConditionReports
  ): Promise<IPaginationReturn<IReport[]>> => {
    return await requestReports
      .postAndGetManyPaginated({
        path: `${pathReports}/dynamically?${queryParams}`,
        sendAuthorization: true,
        body: { condition },
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message);
      });
  };

  const deleteReport = async (id: string): Promise<void> => {
    await requestReports
      .remove({ path: `${pathReports}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const goToGenerateReport = async (
    id: string
  ): Promise<IERPGenerateReportResponse> => {
    return await requestReportGenerate
      .getOne({
        path: `${pathReports}/generate/${id}`,
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
    listReportById,
    listAllReports,
    listReportsDynamically,
    createReport,
    updateReport,
    deleteReport,
    goToGenerateReport,
  };
};

export { useReportService };
