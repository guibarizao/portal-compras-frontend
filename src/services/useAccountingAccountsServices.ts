import AppError from "../errors/AppError";

import IAccountingAccount from "../interfaces/IAccountingAccount";
import { IPaginationReturn } from "../interfaces/IPaginationReturn";
import { useRequest } from "./useRequest";

const useAccountingAccountsService = () => {
  const requestAccountingAccounts = useRequest<IAccountingAccount>();
  const pathAccountingAccounts = "accounting-accounts";

  const createAccountingAccount = async (
    accountingAccount: IAccountingAccount
  ): Promise<IAccountingAccount> => {
    return await requestAccountingAccounts
      .post({
        path: `${pathAccountingAccounts}/`,
        sendAuthorization: true,
        body: accountingAccount,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const updateAccountingAccount = async (
    id: string,
    accountingAccount: IAccountingAccount
  ): Promise<IAccountingAccount> => {
    return await requestAccountingAccounts
      .put({
        path: `${pathAccountingAccounts}/${id}`,
        sendAuthorization: true,
        body: accountingAccount,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAccountingAccountById = async (
    id: string
  ): Promise<IAccountingAccount> => {
    return await requestAccountingAccounts
      .getOne({
        path: `${pathAccountingAccounts}/${id}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message, error.status);
      });
  };

  const listAllAccountingAccounts = async (
    queryParams: string
  ): Promise<IPaginationReturn<IAccountingAccount[]>> => {
    const response = await requestAccountingAccounts
      .getManyPaginated({
        path: `${pathAccountingAccounts}?${queryParams}`,
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

  const listAccountingAccountsDynamically = async (
    queryParams: string
  ): Promise<IPaginationReturn<IAccountingAccount[]>> => {
    return await requestAccountingAccounts
      .getManyPaginated({
        path: `${pathAccountingAccounts}/dynamically?${queryParams}`,
        sendAuthorization: true,
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new AppError(error.message);
      });
  };

  const deleteAccountingAccount = async (id: string): Promise<void> => {
    await requestAccountingAccounts
      .remove({
        path: `${pathAccountingAccounts}/${id}`,
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
    listAccountingAccountById,
    listAllAccountingAccounts,
    listAccountingAccountsDynamically,
    createAccountingAccount,
    updateAccountingAccount,
    deleteAccountingAccount,
  };
};

export { useAccountingAccountsService };
