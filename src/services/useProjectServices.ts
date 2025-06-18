import AppError from "../errors/AppError";

import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IProject from "../interfaces/IProject";
import { useRequest } from "./useRequest";

const useProjectService = () => {
  const requestProjects = useRequest<IProject>();
  const requestProjectsReport = useRequest<{ file: string }>();
  const pathProjects = "projects";

  const createProject = async (project: IProject): Promise<IProject> => {
    return await requestProjects
      .post({
        path: `${pathProjects}/`,
        sendAuthorization: true,
        body: project,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateProject = async (
    id: string,
    project: IProject
  ): Promise<IProject> => {
    return await requestProjects
      .put({
        path: `${pathProjects}/${id}`,
        sendAuthorization: true,
        body: project,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listProjectById = async (id: string): Promise<IProject> => {
    return await requestProjects
      .getOne({ path: `${pathProjects}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllProjects = async (
    queryParams: string
  ): Promise<IPaginationReturn<IProject[]>> => {
    const response = await requestProjects
      .getManyPaginated({
        path: `${pathProjects}?${queryParams}`,
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

  const listProjectsDynamically = async (
    queryParams: string
  ): Promise<IPaginationReturn<IProject[]>> => {
    return await requestProjects
      .getManyPaginated({
        path: `${pathProjects}/dynamically?${queryParams}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message);
      });
  };

  const generateProjectReport = async (
    projectId: string
  ): Promise<{ file: string }> => {
    return await requestProjectsReport
      .post({
        path: `${pathProjects}/report`,
        sendAuthorization: true,
        body: { projectId },
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const deleteProject = async (id: string): Promise<void> => {
    await requestProjects
      .remove({ path: `${pathProjects}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  return {
    listProjectById,
    listAllProjects,
    listProjectsDynamically,
    generateProjectReport,
    createProject,
    updateProject,
    deleteProject,
  };
};

export { useProjectService };
