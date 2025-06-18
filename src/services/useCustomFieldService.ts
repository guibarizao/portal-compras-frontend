import AppError from "../errors/AppError";
import ICustomField from "../interfaces/ICustomField";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import { useRequest } from "./useRequest";

const useCustomFieldService = () => {
  const requestCustomFields = useRequest<ICustomField>();
  const pathCustomFields = "custom-fields";

  const createCustomField = async (
    customField: ICustomField
  ): Promise<ICustomField> => {
    return await requestCustomFields
      .post({
        path: `${pathCustomFields}/`,
        sendAuthorization: true,
        body: customField,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateCustomField = async (
    id: string,
    customField: ICustomField
  ): Promise<ICustomField> => {
    return await requestCustomFields
      .put({
        path: `${pathCustomFields}/${id}`,
        sendAuthorization: true,
        body: customField,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listCustomFieldById = async (id: string): Promise<ICustomField> => {
    return await requestCustomFields
      .getOne({
        path: `${pathCustomFields}/${id}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllCustomFields = async (
    queryParams: string
  ): Promise<IPaginationReturn<ICustomField[]>> => {
    const response = await requestCustomFields
      .getManyPaginated({
        path: `${pathCustomFields}?${queryParams}`,
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

  const deleteCustomField = async (id: string): Promise<void> => {
    await requestCustomFields
      .remove({
        path: `${pathCustomFields}/${id}`,
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
    listCustomFieldById,
    listAllCustomFields,
    createCustomField,
    updateCustomField,
    deleteCustomField,
  };
};

export { useCustomFieldService };
