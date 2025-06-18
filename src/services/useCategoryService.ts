import AppError from "../errors/AppError";

import ICategory from "../interfaces/ICategory";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import { useRequest } from "./useRequest";

const useCategoryService = () => {
  const requestCategories = useRequest<ICategory>();
  const pathCategories = "categories";

  const createCategory = async (category: ICategory): Promise<ICategory> => {
    return await requestCategories
      .post({
        path: `${pathCategories}/`,
        sendAuthorization: true,
        body: category,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateCategory = async (
    id: string,
    category: ICategory
  ): Promise<ICategory> => {
    return await requestCategories
      .put({
        path: `${pathCategories}/${id}`,
        sendAuthorization: true,
        body: category,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listCategoryById = async (id: string): Promise<ICategory> => {
    return await requestCategories
      .getOne({ path: `${pathCategories}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllCategories = async (
    queryParams: string
  ): Promise<IPaginationReturn<ICategory[]>> => {
    const response = await requestCategories
      .getManyPaginated({
        path: `${pathCategories}?${queryParams}`,
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

  const deleteCategory = async (id: string): Promise<void> => {
    await requestCategories
      .remove({ path: `${pathCategories}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  return {
    listCategoryById,
    listAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

export { useCategoryService };
