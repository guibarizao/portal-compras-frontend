import AppError from "../errors/AppError";
import ICustomFieldListOption from "../interfaces/ICustomFieldListOption";
import { useRequest } from "./useRequest";

const useCustomFieldListOptionsService = () => {
  const requestCustomFieldListOptions = useRequest<ICustomFieldListOption>();
  const pathCustomFieldListOptions = "custom-field-list-options";

  const deleteCustomFieldListOption = async (id: string): Promise<void> => {
    await requestCustomFieldListOptions
      .remove({
        path: `${pathCustomFieldListOptions}/${id}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const findCustomFieldListOption = async (
    custonFieldId: string
  ): Promise<ICustomFieldListOption[]> => {
    const resource = await requestCustomFieldListOptions
      .getMany({
        path: `${pathCustomFieldListOptions}/options/${custonFieldId}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });

    return resource;
  };

  return {
    deleteCustomFieldListOption,
    findCustomFieldListOption,
  };
};

export { useCustomFieldListOptionsService };
