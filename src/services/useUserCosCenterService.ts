import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IUserCostCenter from "../interfaces/IUserCostCenter";
import { useRequest } from "./useRequest";

const useUserCostCenterService = () => {
  const requestUserCostCenters = useRequest<IUserCostCenter>();
  const pathUserCostCenters = "users-cost-centers";

  const listAllUserCostCenters = async (
    userId: string,
    queryParams: string
  ): Promise<IPaginationReturn<IUserCostCenter[]>> => {
    const response = await requestUserCostCenters
      .getManyPaginated({
        path: `${pathUserCostCenters}/${userId}?${queryParams}`,
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

  return {
    listAllUserCostCenters,
  };
};

export { useUserCostCenterService };
