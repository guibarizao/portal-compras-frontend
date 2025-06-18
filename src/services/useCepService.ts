import AppError from "../errors/AppError";
import ICep from "../interfaces/ICep";
import { useRequest } from "./useRequest";

const useCepService = () => {
  const requestCep = useRequest<ICep>();
  const pathCep = "cep";

  const listCep = async (cep: string): Promise<ICep> => {
    return await requestCep
      .getOne({ path: `${pathCep}/${cep}`, sendAuthorization: false })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  return {
    listCep,
  };
};

export { useCepService };
