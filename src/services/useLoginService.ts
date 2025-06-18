import AppError from "../errors/AppError";
import IFindSession from "../interfaces/IFindSession";
import IUserToken from "../interfaces/IUserToken";
import { useRequest } from "./useRequest";

const useLoginService = () => {
  const request = useRequest<IUserToken>();
  const path = "session";

  const login = async (
    username: string,
    password: string
  ): Promise<IUserToken> => {
    return await request
      .post({
        path: `${path}`,
        body: { username, password },
        sendAuthorization: false,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error?.status || 400);
      });
  };

  const findSession = async ({
    username,
    expires_in,
    access_token,
    refresh_token,
  }: IFindSession): Promise<IUserToken> => {
    return await request
      .post({
        path: `${path}/find`,
        body: { username, expires_in, access_token, refresh_token },
        sendAuthorization: false,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message);
      });
  };
  return { login, findSession };
};

export { useLoginService };
