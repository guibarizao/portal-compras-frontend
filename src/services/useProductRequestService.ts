import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IProductRequest from "../interfaces/IProductRequest";
import { useRequest } from "./useRequest";

const useProductRequestService = () => {
  const requestProductRequests = useRequest<IProductRequest>();

  const pathProductRequests = "product-requests";

  const createProductRequest = async (
    productRequest: IProductRequest
  ): Promise<IProductRequest> => {
    return await requestProductRequests
      .post({
        path: `${pathProductRequests}/`,
        sendAuthorization: true,
        body: productRequest,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateProductRequest = async (
    id: string,
    productRequest: IProductRequest
  ): Promise<IProductRequest> => {
    return await requestProductRequests
      .put({
        path: `${pathProductRequests}/${id}`,
        sendAuthorization: true,
        body: productRequest,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listProductRequestById = async (
    id: string
  ): Promise<IProductRequest> => {
    return await requestProductRequests
      .getOne({ path: `${pathProductRequests}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllProductRequests = async (
    queryParams: string
  ): Promise<IPaginationReturn<IProductRequest[]>> => {
    const response = await requestProductRequests
      .getManyPaginated({
        path: `${pathProductRequests}?${queryParams}`,
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

  const deleteProductRequest = async (id: string): Promise<void> => {
    await requestProductRequests
      .remove({ path: `${pathProductRequests}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const closeProductRequest = async (id: string): Promise<IProductRequest> => {
    return await requestProductRequests
      .patch({
        path: `${pathProductRequests}/close/${id}`,
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
    listProductRequestById,
    listAllProductRequests,
    createProductRequest,
    updateProductRequest,
    deleteProductRequest,
    closeProductRequest,
  };
};

export { useProductRequestService };
