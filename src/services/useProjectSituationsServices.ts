import AppError from "../errors/AppError";
import IProjectSituation from "../interfaces/IProjectSituation";
import { useRequest } from "./useRequest";

const useProjectSituationsService = () => {
  const requestProjects = useRequest<IProjectSituation>();
  const pathProjects = "project-situations";

  const listAllProjectSituations = async (): Promise<IProjectSituation[]> => {
    const response = await requestProjects
      .getMany({
        path: `${pathProjects}`,
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
    listAllProjectSituations,
  };
};

export { useProjectSituationsService };
