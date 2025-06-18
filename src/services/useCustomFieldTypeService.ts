import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import ICustomFieldType from "../interfaces/ICustomFieldType";
import { useRequest } from "./useRequest";

const useCustomFieldTypeService = () => {
  const requestCustomFieldTypes = useRequest<ICustomFieldType>();
  const pathCustomFieldTypes = "custom-field-types";

  const createCustomFieldType = async (
    customFieldType: ICustomFieldType
  ): Promise<ICustomFieldType> => {
    return await requestCustomFieldTypes
      .post({
        path: `${pathCustomFieldTypes}/`,
        sendAuthorization: true,
        body: customFieldType,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateCustomFieldType = async (
    id: number,
    customFieldType: ICustomFieldType
  ): Promise<ICustomFieldType> => {
    return await requestCustomFieldTypes
      .put({
        path: `${pathCustomFieldTypes}/${id}`,
        sendAuthorization: true,
        body: customFieldType,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listCustomFieldTypeById = async (
    id: number
  ): Promise<ICustomFieldType> => {
    return await requestCustomFieldTypes
      .getOne({
        path: `${pathCustomFieldTypes}/${id}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllCustomFieldTypes = async (
    queryParams: string
  ): Promise<IPaginationReturn<ICustomFieldType[]>> => {
    const response = await requestCustomFieldTypes
      .getManyPaginated({
        path: `${pathCustomFieldTypes}?${queryParams}`,
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

  const deleteCustomFieldType = async (id: number): Promise<void> => {
    await requestCustomFieldTypes
      .remove({
        path: `${pathCustomFieldTypes}/${id}`,
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
    listCustomFieldTypeById,
    listAllCustomFieldTypes,
    createCustomFieldType,
    updateCustomFieldType,
    deleteCustomFieldType,
  };
};

export { useCustomFieldTypeService };
