import AppError from "../errors/AppError";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import IUser from "../interfaces/IUser";
import { useRequest } from "./useRequest";

const useUserService = () => {
  const requestUsers = useRequest<IUser>();
  const pathUsers = "users";

  const createUser = async (user: IUser): Promise<IUser> => {
    return await requestUsers
      .post({
        path: `${pathUsers}/`,
        sendAuthorization: true,
        body: user,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateUser = async (id: string, user: IUser): Promise<IUser> => {
    return await requestUsers
      .put({
        path: `${pathUsers}/${id}`,
        sendAuthorization: true,
        body: user,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listUserById = async (id: string): Promise<IUser> => {
    return await requestUsers
      .getOne({ path: `${pathUsers}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllUsers = async (
    queryParams: string
  ): Promise<IPaginationReturn<IUser[]>> => {
    const response = await requestUsers
      .getManyPaginated({
        path: `${pathUsers}?${queryParams}`,
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

  const deleteUser = async (id: string): Promise<void> => {
    await requestUsers
      .remove({ path: `${pathUsers}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  return {
    listUserById,
    listAllUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};

export { useUserService };
