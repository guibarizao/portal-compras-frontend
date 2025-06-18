import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import ICustomFieldDocumentType from "../interfaces/ICustomFieldDocumentType";
import { useRequest } from "./useRequest";

const useCustomFieldDocumentTypeService = () => {
  const requestCustomFieldDocumentTypes =
    useRequest<ICustomFieldDocumentType>();
  const pathCustomFieldDocumentTypes = "custom-field-document-types";

  const createCustomFieldDocumentType = async (
    customFieldDocumentType: ICustomFieldDocumentType
  ): Promise<ICustomFieldDocumentType> => {
    return await requestCustomFieldDocumentTypes
      .post({
        path: `${pathCustomFieldDocumentTypes}/`,
        sendAuthorization: true,
        body: customFieldDocumentType,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateCustomFieldDocumentType = async (
    id: number,
    customFieldDocumentType: ICustomFieldDocumentType
  ): Promise<ICustomFieldDocumentType> => {
    return await requestCustomFieldDocumentTypes
      .put({
        path: `${pathCustomFieldDocumentTypes}/${id}`,
        sendAuthorization: true,
        body: customFieldDocumentType,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listCustomFieldDocumentTypeById = async (
    id: number
  ): Promise<ICustomFieldDocumentType> => {
    return await requestCustomFieldDocumentTypes
      .getOne({
        path: `${pathCustomFieldDocumentTypes}/${id}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllCustomFieldDocumentTypes = async (
    queryParams: string
  ): Promise<IPaginationReturn<ICustomFieldDocumentType[]>> => {
    const response = await requestCustomFieldDocumentTypes
      .getManyPaginated({
        path: `${pathCustomFieldDocumentTypes}?${queryParams}`,
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

  const deleteCustomFieldDocumentType = async (id: number): Promise<void> => {
    await requestCustomFieldDocumentTypes
      .remove({
        path: `${pathCustomFieldDocumentTypes}/${id}`,
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
    listCustomFieldDocumentTypeById,
    listAllCustomFieldDocumentTypes,
    createCustomFieldDocumentType,
    updateCustomFieldDocumentType,
    deleteCustomFieldDocumentType,
  };
};

export { useCustomFieldDocumentTypeService };
