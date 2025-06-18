import AppError from "../errors/AppError";

import IWallet from "../interfaces/IWallet";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import { useRequest } from "./useRequest";

const useWalletService = () => {
  const requestWallets = useRequest<IWallet>();
  const pathWallets = "wallets";

  const createWallet = async (wallet: IWallet): Promise<IWallet> => {
    return await requestWallets
      .post({
        path: `${pathWallets}/`,
        sendAuthorization: true,
        body: wallet,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateWallet = async (
    id: string,
    wallet: IWallet
  ): Promise<IWallet> => {
    return await requestWallets
      .put({
        path: `${pathWallets}/${id}`,
        sendAuthorization: true,
        body: wallet,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listWalletById = async (id: string): Promise<IWallet> => {
    return await requestWallets
      .getOne({ path: `${pathWallets}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllWallets = async (
    queryParams: string
  ): Promise<IPaginationReturn<IWallet[]>> => {
    const response = await requestWallets
      .getManyPaginated({
        path: `${pathWallets}?${queryParams}`,
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

  const listWalletsDynamically = async (
    queryParams: string
  ): Promise<IPaginationReturn<IWallet[]>> => {
    return await requestWallets
      .getManyPaginated({
        path: `${pathWallets}/dynamically?${queryParams}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message);
      });
  };

  const deleteWallet = async (id: string): Promise<void> => {
    await requestWallets
      .remove({ path: `${pathWallets}/${id}`, sendAuthorization: true })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  return {
    listWalletById,
    listAllWallets,
    listWalletsDynamically,
    createWallet,
    updateWallet,
    deleteWallet,
  };
};

export { useWalletService };
