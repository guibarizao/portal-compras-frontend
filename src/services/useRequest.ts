import axios from "axios";
import { useState } from "react";
import { useAuth } from "../hooks/auth";
import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IHeadOffice from "../interfaces/IHeadOffice";

interface IRequestParams {
  path?: string;
  body?: any;
  headers?: any;
  sendAuthorization?: boolean;
}

export interface IRequest<T> {
  post(request: IRequestParams): Promise<T>;
  postAndGetManyPaginated(
    request: IRequestParams
  ): Promise<IPaginationReturn<T[]>>;
  put(request: IRequestParams): Promise<T>;
  patch(request: IRequestParams): Promise<T>;
  getOne(request: IRequestParams): Promise<T>;
  getMany(request: IRequestParams): Promise<T[]>;
  getManyPaginated(request: IRequestParams): Promise<IPaginationReturn<T[]>>;
  remove(request: IRequestParams): Promise<void>;
}

const validateUrl = () => {
  if (!process.env.REACT_APP_BASE_API_URL) {
    throw new AppError(
      "A url base da API não foi informada. É necessário verificar o arquivo .env"
    );
  }
};

const getHeadOfficeId = (): string | null => {
  const headOfficeString = sessionStorage.getItem(
    "@PORTAL-COMPRAS:currentHeadOffice"
  );

  if (headOfficeString) {
    const headOffice: IHeadOffice = JSON.parse(headOfficeString);

    return headOffice?.id ? headOffice.id : null;
  }

  return null;
};

export const useRequest = <T>(): IRequest<T> => {
  const [baseUrl] = useState(process.env.REACT_APP_BASE_API_URL);
  const { state: userState } = useAuth();

  const post = async (request: IRequestParams): Promise<T> => {
    validateUrl();

    const headers = { ...request.headers };

    const headOfficeId = getHeadOfficeId();

    if (headOfficeId) {
      headers.headOfficeId = headOfficeId;
    }

    if (request.sendAuthorization) {
      headers.Authorization = `Bearer ${userState.access_token}`;
    }
    return await axios({
      url: `${baseUrl}/${request.path}`,
      method: "POST",
      headers,
      data: { ...request.body },
    })
      .then((res: any) => {
        return res.data;
      })
      .catch((error: any) => {
        throw new AppError(
          error?.response?.data?.validation?.params?.message ||
            error?.response?.data?.validation?.body?.message ||
            error?.response?.data?.validation?.query?.message ||
            error?.response?.data?.message ||
            "Ocorreu um erro ao executar o procedimento",
          error?.response?.status || 400
        );
      });
  };

  const put = async (request: IRequestParams): Promise<any> => {
    validateUrl();

    const headers = { ...request.headers };

    const headOfficeId = getHeadOfficeId();

    if (headOfficeId) {
      headers.headOfficeId = headOfficeId;
    }

    if (request.sendAuthorization) {
      headers.Authorization = `Bearer ${userState.access_token}`;
    }

    return await axios({
      url: `${baseUrl}/${request.path}`,
      method: "PUT",
      headers,
      data: { ...request.body },
    })
      .then((res: any) => {
        return res.data;
      })
      .catch((error: any) => {
        throw new AppError(
          error?.response?.data?.validation?.params?.message ||
            error?.response?.data?.validation?.body?.message ||
            error?.response?.data?.validation?.query?.message ||
            error?.response?.data?.message ||
            "Ocorreu um erro ao executar o procedimento",
          error?.response?.status || 400
        );
      });
  };

  const patch = async (request: IRequestParams): Promise<any> => {
    validateUrl();

    const headers = { ...request.headers };

    const headOfficeId = getHeadOfficeId();

    if (headOfficeId) {
      headers.headOfficeId = headOfficeId;
    }

    if (request.sendAuthorization) {
      headers.Authorization = `Bearer ${userState.access_token}`;
    }

    return await axios({
      url: `${baseUrl}/${request.path}`,
      method: "PATCH",
      headers,
      data: request.body,
    })
      .then((res: any) => {
        return res.data;
      })
      .catch((error: any) => {
        throw new AppError(
          error?.response?.data?.validation?.params?.message ||
            error?.response?.data?.validation?.body?.message ||
            error?.response?.data?.validation?.query?.message ||
            error?.response?.data?.message ||
            "Ocorreu um erro ao executar o procedimento",
          error?.response?.status || 400
        );
      });
  };

  const remove = async (request: IRequestParams): Promise<void> => {
    validateUrl();

    const headers = { ...request.headers };

    const headOfficeId = getHeadOfficeId();

    if (headOfficeId) {
      headers.headOfficeId = headOfficeId;
    }

    if (request.sendAuthorization) {
      headers.Authorization = `Bearer ${userState.access_token}`;
    }

    return await axios({
      url: `${baseUrl}/${request.path}`,
      method: "DELETE",
      headers,
      data: { ...request.body },
    })
      .then((res: any) => {
        return res.data;
      })
      .catch((error: any) => {
        throw new AppError(
          error?.response?.data?.validation?.params?.message ||
            error?.response?.data?.validation?.body?.message ||
            error?.response?.data?.validation?.query?.message ||
            error?.response?.data?.message ||
            "Ocorreu um erro ao executar o procedimento",
          error?.response?.status || 400
        );
      });
  };

  const getOne = async (request: IRequestParams): Promise<T> => {
    validateUrl();

    const headers = { ...request.headers };

    const headOfficeId = getHeadOfficeId();

    if (headOfficeId) {
      headers.headOfficeId = headOfficeId;
    }

    if (request.sendAuthorization) {
      headers.Authorization = `Bearer ${userState.access_token}`;
    }

    return await axios({
      url: `${baseUrl}/${request.path}`,
      method: "GET",
      headers,
    })
      .then((res: any) => {
        return res.data;
      })
      .catch((error: any) => {
        throw new AppError(
          error?.response?.data?.validation?.params?.message ||
            error?.response?.data?.validation?.body?.message ||
            error?.response?.data?.validation?.query?.message ||
            error?.response?.data?.message ||
            "Ocorreu um erro ao executar o procedimento",
          error?.response?.status || 400
        );
      });
  };

  const getMany = async (request: IRequestParams): Promise<T[]> => {
    validateUrl();

    const headers = { ...request.headers };

    const headOfficeId = getHeadOfficeId();

    if (headOfficeId) {
      headers.headOfficeId = headOfficeId;
    }

    if (request.sendAuthorization) {
      headers.Authorization = `Bearer ${userState.access_token}`;
    }

    return await axios({
      url: `${baseUrl}/${request.path}`,
      method: "GET",
      headers,
    })
      .then((res: any) => {
        return res.data;
      })
      .catch((error: any) => {
        throw new AppError(
          error?.response?.data?.validation?.params?.message ||
            error?.response?.data?.validation?.body?.message ||
            error?.response?.data?.validation?.query?.message ||
            error?.response?.data?.message ||
            "Ocorreu um erro ao executar o procedimento",
          error?.response?.status || 400
        );
      });
  };

  const getManyPaginated = async (
    request: IRequestParams
  ): Promise<IPaginationReturn<T[]>> => {
    validateUrl();

    const headers = { ...request.headers };

    const headOfficeId = getHeadOfficeId();

    if (headOfficeId) {
      headers.headOfficeId = headOfficeId;
    }

    if (request.sendAuthorization) {
      headers.Authorization = `Bearer ${userState.access_token}`;
    }

    return await axios({
      url: `${baseUrl}/${request.path}`,
      method: "GET",
      headers,
    })
      .then((res: any) => {
        return res.data;
      })
      .catch((error: any) => {
        throw new AppError(
          error?.response?.data?.validation?.params?.message ||
            error?.response?.data?.validation?.body?.message ||
            error?.response?.data?.validation?.query?.message ||
            error?.response?.data?.message ||
            "Ocorreu um erro ao executar o procedimento",
          error?.response?.status || 400
        );
      });
  };

  const postAndGetManyPaginated = async (
    request: IRequestParams
  ): Promise<IPaginationReturn<T[]>> => {
    validateUrl();

    const headers = { ...request.headers };

    const headOfficeId = getHeadOfficeId();

    if (headOfficeId) {
      headers.headOfficeId = headOfficeId;
    }

    if (request.sendAuthorization) {
      headers.Authorization = `Bearer ${userState.access_token}`;
    }

    return await axios({
      url: `${baseUrl}/${request.path}`,
      method: "POST",
      headers,
      data: { ...request.body },
    })
      .then((res: any) => {
        return res.data;
      })
      .catch((error: any) => {
        throw new AppError(
          error?.response?.data?.validation?.params?.message ||
            error?.response?.data?.validation?.body?.message ||
            error?.response?.data?.validation?.query?.message ||
            error?.response?.data?.message ||
            "Ocorreu um erro ao executar o procedimento",
          error?.response?.status || 400
        );
      });
  };

  return {
    post,
    getOne,
    getMany,
    put,
    remove,
    getManyPaginated,
    patch,
    postAndGetManyPaginated,
  };
};
