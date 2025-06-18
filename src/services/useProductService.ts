import AppError from "../errors/AppError";
import IProduct from "../interfaces/IProduct";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import { useRequest } from "./useRequest";

const useProductService = () => {
  const requestProducts = useRequest<IProduct>();
  const requestProductsReport = useRequest<{ file: string }>();

  const pathProducts = "products";

  const createProduct = async (product: IProduct): Promise<IProduct> => {
    return await requestProducts
      .post({
        path: `${pathProducts}/`,
        sendAuthorization: true,
        body: product,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateProduct = async (
    id: string,
    product: IProduct
  ): Promise<IProduct> => {
    return await requestProducts
      .put({
        path: `${pathProducts}/${id}`,
        sendAuthorization: true,
        body: product,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listProductById = async (id: string): Promise<IProduct> => {
    return await requestProducts
      .getOne({ path: `${pathProducts}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllProducts = async (
    queryParams: string
  ): Promise<IPaginationReturn<IProduct[]>> => {
    const response = await requestProducts
      .getManyPaginated({
        path: `${pathProducts}?${queryParams}`,
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

  const listProductsDynamically = async (
    queryParams: string
  ): Promise<IPaginationReturn<IProduct[]>> => {
    return await requestProducts
      .getManyPaginated({
        path: `${pathProducts}/dynamically?${queryParams}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message);
      });
  };

  const generateProductReport = async (
    productId: string
  ): Promise<{ file: string }> => {
    return await requestProductsReport
      .post({
        path: `${pathProducts}/report`,
        sendAuthorization: true,
        body: { productId },
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const deleteProduct = async (id: string): Promise<void> => {
    await requestProducts
      .remove({ path: `${pathProducts}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  return {
    listProductById,
    listAllProducts,
    listProductsDynamically,
    createProduct,
    updateProduct,
    generateProductReport,
    deleteProduct,
  };
};

export { useProductService };
