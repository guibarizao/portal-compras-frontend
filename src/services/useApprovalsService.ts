import axios from "axios";
import AppError from "../errors/AppError";
import { IApprovalTask } from "../interfaces/IApprovalTask";

interface IResponseApprovalTask {
  tasks: IApprovalTask[];
  total: number;
}

interface IRequestParams {
  offset: number;
  limit: number;
  sortField: string;
  sortDirection: "ASC" | "DESC";
}

interface IUpdateTaskParams {
  accessToken: string;
  taskId: string;
  answerDate: string;
  takenOptionId: string;
  note: string;
}

const useApprovalsService = () => {
  const getPendingTasks = async (
    accessToken: string
  ): Promise<IResponseApprovalTask> => {
    const baseUrl = process.env.REACT_APP_SENIORX_URL;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    return await axios({
      url: `${baseUrl}/decision_center/queries/getPendingTasks`,
      method: "POST",
      headers,
      data: {
        page: 0,
        count: 1000,
      },
    })
      .then((result) => {
        return result.data;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listTasks = async (
    accessToken: string,
    data: IRequestParams
  ): Promise<IResponseApprovalTask> => {
    const baseUrl = process.env.REACT_APP_SENIORX_URL;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    return await axios({
      url: `${baseUrl}/decision_center/queries/listTasks`,
      method: "POST",
      headers,
      data: { executionFilter: ["unanswered"], ...data },
    })
      .then((result) => {
        return result.data;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateAnsweredTasks = async ({
    accessToken,
    taskId,
    answerDate,
    takenOptionId,
    note,
  }: IUpdateTaskParams): Promise<void> => {
    const baseUrl = process.env.REACT_APP_SENIORX_URL;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return await axios({
      url: `${baseUrl}/decision_center/actions/updateAnsweredTasks`,
      method: "POST",
      headers,
      data: {
        tasksAnswers: [
          {
            taskId,
            answerDate,
            takenOptionId,
            note,
          },
        ],
      },
    })
      .then(() => {
        return;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  return {
    getPendingTasks,
    listTasks,
    updateAnsweredTasks,
  };
};

export { useApprovalsService };
